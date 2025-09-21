from datetime import timedelta, date
from dateutil.relativedelta import relativedelta
from ..models import Transaction, Income
from django.contrib.contenttypes.models import ContentType

def generate_calendar_events_for_income(income: Income):
    current = income.start_date
    end = income.end_date or (date.today() + relativedelta(years=1))  # default: 1 year ahead

    while current <= end:

        # Create matching transaction if not already existing
        Transaction.objects.get_or_create(
            author=income.author,
            income_id=income.id,
            post_date=current,
            transaction_date=current,
            amount=income.amount,
            description=income.name,
            category_type=ContentType.objects.get_for_model(income),
            category_id=income.id,
        )

        # Step to next recurrence
        if income.recurrence == 'daily':
            current += timedelta(days=1)
        elif income.recurrence == 'monthly':
            current += relativedelta(months=1)
        elif income.recurrence == 'yearly':
            current += relativedelta(years=1)
        else:
            break


def generate_calendar_events_for_expense(transaction: Transaction):

    # Ensure transaction is recorded (in case this function is called separately)
    Transaction.objects.get_or_create(
        author=transaction.author,
        trans_date=transaction.trans_date,
        amount=transaction.amount,
        category=transaction.category,
        defaults={
            'description': transaction.description or "Expense Transaction",
            'merchant': getattr(transaction, 'merchant', None),
        }
    )

