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
 
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        pass

class AIAgentsView(APIView):
    def post(self, request, *args, **kwargs):
        pass

class DownloadReportView(APIView):
    def post(self, request, *args, **kwargs):
        pass
