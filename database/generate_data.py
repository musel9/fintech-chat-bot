
import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('ar_SA') # Use Arabic locale for more realistic names and addresses

def generate_customers(num_customers=500):
    customers = []
    for i in range(1, num_customers + 1):
        gender = random.choice(['ذكر', 'أنثى'])
        first_name = fake.first_name_male() if gender == 'ذكر' else fake.first_name_female()
        last_name = fake.last_name()
        dob = fake.date_of_birth(minimum_age=18, maximum_age=70)
        address = fake.address()
        city = fake.city()
        state = fake.state()
        zip_code = fake.postcode()
        phone_number = fake.phone_number()
        email = fake.email()
        nationality = fake.country()
        id_type = random.choice(['بطاقة هوية وطنية', 'جواز سفر'])
        id_number = fake.unique.ssn()
        registration_date = fake.date_between(start_date='-10y', end_date='today')

        customers.append({
            'customer_id': i,
            'first_name': first_name,
            'last_name': last_name,
            'date_of_birth': dob,
            'gender': gender,
            'address': address,
            'city': city,
            'state': state,
            'zip_code': zip_code,
            'phone_number': phone_number,
            'email': email,
            'nationality': nationality,
            'id_type': id_type,
            'id_number': id_number,
            'registration_date': registration_date
        })
    return pd.DataFrame(customers)

def generate_employees(num_employees=50):
    employees = []
    positions = ['صراف', 'مسؤول خدمة عملاء', 'مدير فرع', 'مسؤول ائتمان', 'مسؤول دعم فني', 'محاسب', 'مدير حسابات', 'محلل مالي']
    departments = ['العمليات', 'خدمة العملاء', 'الإدارة', 'الائتمان', 'الدعم الفني', 'المحاسبة', 'المالية']

    for i in range(1, num_employees + 1):
        gender = random.choice(['ذكر', 'أنثى'])
        first_name = fake.first_name_male() if gender == 'ذكر' else fake.first_name_female()
        last_name = fake.last_name()
        dob = fake.date_of_birth(minimum_age=22, maximum_age=60)
        address = fake.address()
        phone_number = fake.phone_number()
        email = fake.unique.email()
        position = random.choice(positions)
        department = random.choice(departments)
        hire_date = fake.date_between(start_date='-15y', end_date='today')
        salary = round(random.uniform(4000, 25000), 2)

        employees.append({
            'employee_id': i,
            'first_name': first_name,
            'last_name': last_name,
            'date_of_birth': dob,
            'gender': gender,
            'address': address,
            'phone_number': phone_number,
            'email': email,
            'position': position,
            'department': department,
            'hire_date': hire_date,
            'salary': salary
        })
    return pd.DataFrame(employees)

def generate_management(employees_df):
    management = []
    # Select a subset of employees to be managers
    manager_employees = employees_df.sample(n=min(10, len(employees_df)), random_state=1)
    titles = ['الرئيس التنفيذي', 'المدير المالي', 'رئيس قسم العمليات', 'رئيس قسم الموارد البشرية', 'رئيس قسم التكنولوجيا']

    for i, emp in enumerate(manager_employees.itertuples(), 1):
        start_date = fake.date_between(start_date=emp.hire_date, end_date='today')
        end_date = None # For simplicity, assume most are still in position
        if random.random() < 0.2: # 20% chance of having an end date
            end_date = fake.date_between(start_date=start_date, end_date='today')

        management.append({
            'manager_id': i,
            'employee_id': emp.employee_id,
            'title': random.choice(titles),
            'start_date': start_date,
            'end_date': end_date
        })
    return pd.DataFrame(management)

def generate_branches(num_branches=10):
    branches = []
    for i in range(1, num_branches + 1):
        branches.append({
            'branch_id': i,
            'branch_name': f'الفرع رقم {i}',
            'address': fake.address(),
            'city': fake.city(),
            'state': fake.state(),
            'zip_code': fake.postcode(),
            'phone_number': fake.phone_number()
        })
    return pd.DataFrame(branches)

if __name__ == '__main__':
    print("Generating customers data...")
    customers_df = generate_customers(num_customers=500)
    customers_df.to_csv('customers.csv', index=False, encoding='utf-8-sig')
    print(f"Generated {len(customers_df)} customers.")

    print("Generating employees data...")
    employees_df = generate_employees(num_employees=50)
    employees_df.to_csv('employees.csv', index=False, encoding='utf-8-sig')
    print(f"Generated {len(employees_df)} employees.")

    print("Generating management data...")
    management_df = generate_management(employees_df)
    management_df.to_csv('management.csv', index=False, encoding='utf-8-sig')
    print(f"Generated {len(management_df)} management entries.")

    print("Generating branches data...")
    branches_df = generate_branches(num_branches=10)
    branches_df.to_csv('branches.csv', index=False, encoding='utf-8-sig')
    print(f"Generated {len(branches_df)} branches.")

    print("Data generation complete.")


