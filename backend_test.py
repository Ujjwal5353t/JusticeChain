#!/usr/bin/env python3
import requests
import json
import time
import os
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1]
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("Error: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"
print(f"Using API base URL: {API_BASE_URL}")

def test_root_endpoint():
    """Test the root endpoint of the API."""
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint test passed")
                return True
            else:
                print(f"❌ Root endpoint test failed: Unexpected response: {data}")
                return False
        else:
            print(f"❌ Root endpoint test failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint test failed: {str(e)}")
        return False

def test_status_post_endpoint():
    """Test the POST /status endpoint."""
    try:
        client_name = f"Test Client {datetime.now().isoformat()}"
        payload = {"client_name": client_name}
        response = requests.post(f"{API_BASE_URL}/status", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("client_name") == client_name and "id" in data and "timestamp" in data:
                print("✅ POST status endpoint test passed")
                return True, data.get("id")
            else:
                print(f"❌ POST status endpoint test failed: Unexpected response: {data}")
                return False, None
        else:
            print(f"❌ POST status endpoint test failed: Status code {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ POST status endpoint test failed: {str(e)}")
        return False, None

def test_status_get_endpoint(expected_id=None):
    """Test the GET /status endpoint."""
    try:
        response = requests.get(f"{API_BASE_URL}/status")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if expected_id:
                    # Check if our recently created status check is in the list
                    found = any(item.get("id") == expected_id for item in data)
                    if found:
                        print("✅ GET status endpoint test passed (found recently created item)")
                    else:
                        print("❌ GET status endpoint test failed: Recently created item not found")
                        return False
                print(f"✅ GET status endpoint test passed (retrieved {len(data)} items)")
                return True
            else:
                print(f"❌ GET status endpoint test failed: Expected a list, got: {type(data)}")
                return False
        else:
            print(f"❌ GET status endpoint test failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ GET status endpoint test failed: {str(e)}")
        return False

def test_cors_configuration():
    """Test that CORS is properly configured."""
    try:
        # Send an OPTIONS request to simulate a CORS preflight request
        headers = {
            'Origin': 'http://example.com',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{API_BASE_URL}/", headers=headers)
        
        if response.status_code == 200:
            # Check for CORS headers
            if 'access-control-allow-origin' in response.headers:
                allow_origin = response.headers['access-control-allow-origin']
                if allow_origin == '*' or allow_origin == 'http://example.com':
                    print("✅ CORS configuration test passed")
                    return True
                else:
                    print(f"❌ CORS configuration test failed: Unexpected Access-Control-Allow-Origin: {allow_origin}")
                    return False
            else:
                print("❌ CORS configuration test failed: No Access-Control-Allow-Origin header found")
                return False
        else:
            print(f"❌ CORS configuration test failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ CORS configuration test failed: {str(e)}")
        return False

def run_all_tests():
    """Run all tests and return overall result."""
    print("\n🔍 Starting backend API tests...\n")
    
    # Test root endpoint
    root_result = test_root_endpoint()
    
    # Test POST /status endpoint
    post_result, status_id = test_status_post_endpoint()
    
    # Test GET /status endpoint
    get_result = test_status_get_endpoint(status_id)
    
    # Test CORS configuration
    cors_result = test_cors_configuration()
    
    # Overall result
    all_passed = root_result and post_result and get_result and cors_result
    
    print("\n📋 Test Summary:")
    print(f"Root Endpoint: {'✅ Passed' if root_result else '❌ Failed'}")
    print(f"POST Status Endpoint: {'✅ Passed' if post_result else '❌ Failed'}")
    print(f"GET Status Endpoint: {'✅ Passed' if get_result else '❌ Failed'}")
    print(f"CORS Configuration: {'✅ Passed' if cors_result else '❌ Failed'}")
    print(f"\nOverall Result: {'✅ All tests passed!' if all_passed else '❌ Some tests failed!'}")
    
    return all_passed

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)