import pandas as pd
import pdfplumber
from datetime import datetime
from ..models import Transaction, Merchant
from .calendar_event import generate_calendar_events_for_expense

year_today = datetime.now().year

list_of_months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

def extract_transactions_from_pdf(file_path, user):
    transactions = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            
            text = page.extract_text()
            is_transactional = False
            new_item = {}

            for line in text.split('\n'):
                if is_transactional and "Ref No" in line:
                    new_item['refNumber'] = line.replace("Ref No. :","")
                    transactions.append(new_item)
                    transaction = Transaction.objects.create(
                        ref_number = new_item['refNumber'],
                        trans_date = datetime.strptime(new_item['date'], "%d %b %Y"),
                        amount = new_item['amount'],
                        description = new_item['desc'],
                        author = user
                    )

                    generate_calendar_events_for_expense(transaction)

                    # print("Item added :",new_item)

                    new_item = {}
                    is_transactional = False

                if any(month in line for month in list_of_months):
                    items = line.split()

                    if items[1] in list_of_months and items[3] in list_of_months:
                        is_transactional = True
                        new_item = {
                            'date' : items[2] +" "+ items[3] + " "+ str(year_today),
                            'desc' : " ".join(items[4:-1]),
                            'amount' : items[-1]
                        }
                    
    return transactions

def update_transactions_with_merchant(user):
    print("Updating transactions with merchant for user:", user)
    transactions = Transaction.objects.filter(author=user, merchant__isnull=True)
    for transaction in transactions:
        description = transaction.description.upper()
        merchants = Merchant.objects.filter(author=user)
        for merchant in merchants:
            merchant_name = merchant.name.upper()
            possible_names = [word.upper() for word in merchant.keywords] if merchant.keywords else []
            possible_names.append(merchant_name)
            print("Possible names for merchant:", possible_names)
            if any(name in description for name in possible_names):
                transaction.merchant = merchant
                if merchant.category:
                    transaction.category = merchant.category
                transaction.save()
                print(f"Updated transaction {transaction.ref_number} with merchant {merchant.name}")

def update_transactions_with_category(user, merchant_id):
    transactions = Transaction.objects.filter(author=user, merchant__isnull=False)
    merchant = Merchant.objects.filter(pk=merchant_id)
    for transaction in transactions:
        if transaction.merchant == merchant:
            transaction.category == merchant.category
            transaction.save()
            


