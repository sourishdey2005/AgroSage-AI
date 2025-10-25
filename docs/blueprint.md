# **App Name**: AgroWise AI

## Core Features:

- AI Crop Diagnosis: Allow farmers to upload crop images to detect diseases, displaying the disease name, severity, and confidence level using YOLOv8.
- Price Prediction: Use Prophet model to forecast crop prices for the next 7 days, displaying the trend dynamically on the farmer dashboard.
- Intelligent Sell Suggestions: Based on price forecasts and mandi data, the system suggests optimal sell timing and location using a rule engine tool. The best suggestions will incorporate location awareness as appropriate.
- AI Chatbot (AgroBot): Integrate an AI chatbot powered by DistilGPT2 to answer farmer queries via voice or text, supporting multiple languages using IndicTrans.
- Role-Based Dashboards: Provide distinct dashboards for farmers, agents, and government officials, each tailored to their specific needs and data access, including a real-time market analytics and trade optimization agent dashboard as well as a district-wide yield visualization for government officials.
- Receipt Generation: Generate PDF receipts with AI-driven stats for farmers to download.
- User Authentication: Firebase Authentication with login options via email, Google, or Apple. OTP-based verification enabled, role-based access control with hardcoded accounts for agents and government officials.

## Style Guidelines:

- Primary color: Vibrant green (#50C878) to represent growth and agriculture. It symbolizes health, renewal, and prosperity, aligning with the app's focus on empowering farmers.
- Background color: Light green (#E0F8E6), a heavily desaturated shade of the primary, providing a calm and unobtrusive backdrop that keeps the focus on the content.
- Accent color: Yellow-green (#BFFF00), for interactive elements. It will make the elements highly visible.
- Headline font: 'Poppins', a geometric sans-serif, for titles and headings. Body Font: 'PT Sans', a humanist sans-serif.
- Use clear, representative icons related to farming, markets, and data analytics.
- Implement a tab-based navigation system for the Farmer, Agent, and Government dashboards to allow simple transitioning.
- Subtle animations, such as chart transitions and loading indicators, to enhance user experience.