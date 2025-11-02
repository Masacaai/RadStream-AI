import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from models import Patient, Visit 

# Get the directory where this script is located
COMMAND_DIR = os.path.dirname(os.path.abspath(__file__))

class Command(BaseCommand):
    help = 'Populates the database with patient and visit data from patients.csv'

    def handle(self, *args, **options):
        # Path to the CSV file
        csv_file_path = os.path.join(COMMAND_DIR, 'patients.csv')
        
        self.stdout.write(f'Opening CSV file at: {csv_file_path}')

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                patient_count = 0
                visit_count = 0

                for row in reader:
                    # 1. Create or get the Patient
                    # We use get_or_create to avoid duplicating patients on multiple runs
                    # It uses the first, last, and dob as a unique key
                    patient, patient_created = Patient.objects.get_or_create(
                        first_name=row['first_name'],
                        last_name=row['last_name'],
                        dob=row['dob'],
                        defaults={
                            'sex': row['sex'],
                            'medical_history': row['medical_history']
                        }
                    )
                    
                    if patient_created:
                        patient_count += 1

                    # 2. Create the related Visit record
                    # We don't check for duplicates here, assuming one row = one new visit
                    Visit.objects.create(
                        patient=patient,
                        reason_for_visit=row['reason_for_visit']
                    )
                    visit_count += 1

                self.stdout.write(self.style.SUCCESS(
                    f'Successfully created {patient_count} new patients and {visit_count} new visits.'
                ))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Error: The file {csv_file_path} was not found.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {e}'))


