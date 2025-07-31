
import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker("ar_SA")

def generate_accounts(customers_df):
    accounts = []
    account_types = ["توفير", "جاري", "استثمار"]
    currencies = ["SAR", "USD", "EUR"]

    for i, customer in customers_df.iterrows():
        num_accounts = random.randint(1, 3) # Each customer can have 1 to 3 accounts
        for _ in range(num_accounts):
            account_id = len(accounts) + 1
            account_type = random.choice(account_types)
            balance = round(random.uniform(100, 100000), 2)
            currency = random.choice(currencies)
            opening_date = fake.date_between(start_date=customer["registration_date"], end_date="today")
            status = "نشط"

            accounts.append({
                "account_id": account_id,
                "customer_id": customer["customer_id"],
                "account_type": account_type,
                "balance": balance,
                "currency": currency,
                "opening_date": opening_date,
                "status": status
            })
    return pd.DataFrame(accounts)

def generate_transactions(accounts_df, num_transactions=5000):
    transactions = []
    transaction_types = ["إيداع", "سحب", "تحويل", "دفع فواتير"]
    statuses = ["ناجحة", "فاشلة", "معلقة"]

    for i in range(1, num_transactions + 1):
        account = accounts_df.sample(1).iloc[0]
        transaction_type = random.choice(transaction_types)
        amount = round(random.uniform(10, 5000), 2)
        transaction_date = fake.date_time_between(start_date=account["opening_date"], end_date="now")
        description = fake.sentence(nb_words=6, variable_nb_words=True)
        status = random.choice(statuses)
        recipient_account_id = None

        if transaction_type == "تحويل" and len(accounts_df) > 1:
            # Ensure recipient is not the same as sender
            possible_recipients = accounts_df[accounts_df["account_id"] != account["account_id"]]
            if not possible_recipients.empty:
                recipient_account_id = possible_recipients.sample(1).iloc[0]["account_id"]

        transactions.append({
            "transaction_id": i,
            "account_id": account["account_id"],
            "transaction_type": transaction_type,
            "amount": amount,
            "transaction_date": transaction_date,
            "description": description,
            "status": status,
            "recipient_account_id": recipient_account_id
        })
    return pd.DataFrame(transactions)

def generate_loans(customers_df, num_loans=200):
    loans = []
    loan_types = ["شخصي", "عقاري", "سيارة", "تعليمي"]
    statuses = ["نشط", "مدفوع بالكامل", "متعثر"]

    for i in range(1, num_loans + 1):
        customer = customers_df.sample(1).iloc[0]
        loan_type = random.choice(loan_types)
        amount = round(random.uniform(5000, 500000), 2)
        interest_rate = round(random.uniform(0.03, 0.15), 4)
        term_months = random.choice([12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 180, 240, 360])
        start_date = fake.date_between(start_date=customer["registration_date"], end_date="today")
        end_date = start_date + timedelta(days=term_months * 30) # Approximate end date
        status = random.choice(statuses)

        loans.append({
            "loan_id": i,
            "customer_id": customer["customer_id"],
            "loan_type": loan_type,
            "amount": amount,
            "interest_rate": interest_rate,
            "term_months": term_months,
            "start_date": start_date,
            "end_date": end_date,
            "status": status
        })
    return pd.DataFrame(loans)

def generate_payments(loans_df, num_payments_per_loan=10):
    payments = []
    payment_id_counter = 1

    for i, loan in loans_df.iterrows():
        if loan["status"] == "نشط" or loan["status"] == "متعثر":
            num_payments = random.randint(1, num_payments_per_loan)
        else: # Paid in full
            num_payments = loan["term_months"]

        for j in range(num_payments):
            payment_date = loan["start_date"] + timedelta(days=j * 30 + random.randint(0, 20)) # Monthly payments
            if payment_date > datetime.now().date():
                break

            # Simple calculation for principal and interest paid
            monthly_interest_rate = loan["interest_rate"] / 12
            # This is a simplified payment calculation, not a true amortization
            payment_amount = loan["amount"] / loan["term_months"] + (loan["amount"] * monthly_interest_rate)
            payment_amount = round(payment_amount * random.uniform(0.8, 1.2), 2) # Add some variation

            principal_paid = payment_amount * random.uniform(0.5, 0.9) # Assume more goes to principal over time
            interest_paid = payment_amount - principal_paid

            payments.append({
                "payment_id": payment_id_counter,
                "loan_id": loan["loan_id"],
                "payment_date": payment_date,
                "amount": payment_amount,
                "principal_paid": round(principal_paid, 2),
                "interest_paid": round(interest_paid, 2)
            })
            payment_id_counter += 1
    return pd.DataFrame(payments)

if __name__ == "__main__":
    print("Loading customers data...")
    customers_df = pd.read_csv("customers.csv")
    customers_df["registration_date"] = pd.to_datetime(customers_df["registration_date"]).dt.date # Convert to date objects

    print("Generating accounts data...")
    accounts_df = generate_accounts(customers_df)
    accounts_df.to_csv("accounts.csv", index=False, encoding="utf-8-sig")
    print(f"Generated {len(accounts_df)} accounts.")

    print("Generating transactions data...")
    transactions_df = generate_transactions(accounts_df, num_transactions=10000) # Increased transactions
    transactions_df.to_csv("transactions.csv", index=False, encoding="utf-8-sig")
    print(f"Generated {len(transactions_df)} transactions.")

    print("Generating loans data...")
    loans_df = generate_loans(customers_df, num_loans=500) # Increased loans
    loans_df.to_csv("loans.csv", index=False, encoding="utf-8-sig")
    print(f"Generated {len(loans_df)} loans.")

    print("Generating payments data...")
    payments_df = generate_payments(loans_df, num_payments_per_loan=20) # More payments per loan
    payments_df.to_csv("payments.csv", index=False, encoding="utf-8-sig")
    print(f"Generated {len(payments_df)} payments.")

    print("Financial data generation complete.")


