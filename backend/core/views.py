from django.shortcuts import render
from django.contrib.auth.models import User
from core.models import Data
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import requests
from datetime import datetime
from django.http import HttpResponse, JsonResponse
import time as t
from django.conf import settings
from django.http import FileResponse
# Create your views here.

class TestApiView(APIView):
    """
    API endpoint for handling frontend test calls.
    """
    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for the /test_api/ endpoint.
        """
        print("entered post in TestApiView")
        try:
            received_data_dict = request.data
            received_data = received_data_dict.get('data')
            print(f"Received from frontend (DRF): {received_data}")

            if not isinstance(received_data, str) or received_data.strip() == "":
                return Response(
                    {"error": "Invalid data format. Expected a non-empty string."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            response_message = f"Backend received: '{received_data}'. yay :) "
            return Response(
                {"message": response_message, "status": "success", "received_value": received_data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
 
class SaveResultsView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Received data to save:", data)

            # Validate required fields
            required_fields = ["patient_name", "patient_history", "patient_visit_reason", "associated_dcm_image"]
            missing = [f for f in required_fields if f not in data or not data[f]]
            if missing:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the Data object
            record = Data.objects.create(
                patient_name=data["patient_name"],
                patient_history=data["patient_history"],
                patient_visit_reason=data["patient_visit_reason"],
                associated_dcm_image=data["associated_dcm_image"]
            )

            print(f"Saved record ID {record.id} for patient {record.patient_name}")

            return Response(
                {
                    "message": "Patient scan saved successfully!",
                    "record_id": record.id,
                    "patient_name": record.patient_name,
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print("Error saving results:", str(e))
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PresentResultsView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Fetch all records ordered by ID descending (latest first)
            records = Data.objects.all().order_by("-id")[:3]

            if records.exists():
                print(f"✅ Found {records.count()} records in DB.")
                data = [
                    {
                        "title": f"Scan – {r.patient_name}",
                        "summary": f"Visit reason: {r.patient_visit_reason}",
                        "details": [
                            {"label": "Patient", "value": r.patient_name},
                            {"label": "History", "value": r.patient_history},
                            {"label": "Visit Reason", "value": r.patient_visit_reason},
                            {"label": "Associated DICOM", "value": r.associated_dcm_image},
                        ]
                    }
                    for r in records
                ]
            else:
                print("⚠️ No records found — returning demo data.")
                data = [
                    {
                        "title": "Scan 1 – John Doe",
                        "summary": "Pending AI analysis. Click to view details.",
                        "details": [
                            {"label": "Scan ID", "value": "RAD001"},
                            {"label": "Patient", "value": "John Doe"},
                            {"label": "AI Output", "value": "Effusion probability: 0.21"},
                            {"label": "Observation", "value": "Minimal findings"},
                        ],
                    },
                    {
                        "title": "Scan 2 – Abdul Khan",
                        "summary": "AI flagged minor opacity, needs confirmation.",
                        "details": [
                            {"label": "Scan ID", "value": "RAD002"},
                            {"label": "Patient", "value": "Abdul Khan"},
                            {"label": "AI Output", "value": "Opacity confidence: 0.78"},
                            {"label": "Observation", "value": "Likely benign"},
                        ],
                    },
                ]

            return Response({"scans": data}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error in PresentResultsView:", str(e))
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
