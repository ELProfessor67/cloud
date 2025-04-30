import requests

def save_to_db(data):
    url = "http://localhost:7896/files/upload-cube_acr_file"
    response = requests.post(url, data=data)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
