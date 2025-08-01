from datetime import timedelta, date
from dateutil.relativedelta import relativedelta
from ..models import Category, CalendarEvent, Transaction

def generate_calendar_events_for_income(income_plan: Category):
    current = income_plan.start_date
    end = income_plan.end_date or (date.today() + relativedelta(years=1))  # default: 1 year ahead

    while current <= end:
        CalendarEvent.objects.get_or_create(
            user=income_plan.author,
            income_plan=income_plan,
            date=current,
            defaults={'amount': income_plan.amount}
        )

        if income_plan.recurrence == 'daily':
            current += timedelta(days=1)
        elif income_plan.recurrence == 'monthly':
            current += relativedelta(months=1)
        elif income_plan.recurrence == 'yearly':
            current += relativedelta(years=1)
        else :
            end = current

def generate_calendar_events_for_expense(transaction: Transaction):
    amount = transaction.amount

    CalendarEvent.objects.get_or_create(
        user=transaction.author,
        title='expenses',
        defaults={'amount': amount},
        date=transaction.trans_date
    )

