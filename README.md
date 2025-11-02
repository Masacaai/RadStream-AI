# RadStream AI

![RadStream AI frontpage](https://github.com/masacaai/RadStream-AI/blob/main/img.png?raw=true)

RadStream AI complements radiology workflows by documenting and communicating findings through comprehensive data analysis and report-generation.

# Technologies
- React.js
- Django web framework
- smolagents
- HopprAI SDK
- Groq

# Frontend
` cd frontend `

` npm install `

` npm start `

# Backend

## Installing dependencies
` cd backend `

` virtualenv .venv `

` source .venv/bin/active `

` pip install -r requirements.txt `

## Setting environment variables
` echo "HOPPR_API_KEY=<your_hoppr_API_key_here>" > .env `

` echo "GROQ_API_KEY=<your_groq_API_key_here>" >> .env `

## Usage

` python manage.py makemigrations `

` python manage.py migrate `

` python manage.py runserver `

