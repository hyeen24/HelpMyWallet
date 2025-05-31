import pandas as pd
import pdfplumber
from datetime import datetime
from ..models import Transaction

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