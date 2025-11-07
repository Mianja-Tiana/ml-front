# Front Churn Prediction 

The ChurnPrediction Frontend delivers a modern and professional interface for the churn prediction platform.
It includes registration, login, and dashboard pages with role-based access (Admin/User).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation ](#installation-and-setup)

## Aperçu

**Churn Prediction** est une plateforme sophistiquée permettant:
- Prédire le churn (départ) des clients
- Gérer les modèles ML
- Analyser les logs de prédictions
- Soumettre et consulter les retours (feedback)
- Gérer les utilisateurs et permissions

## Overview
The **Churn Prediction** frontend provides an intuitive and responsive interface to:

- Visualize and interpret churn prediction results  
- Manage and deploy machine learning models  
- Monitor prediction logs in real-time  
- Collect and display user feedback  
- Handle user authentication, roles, and permissions  

## Features
### For Administrators
- **User List** - View all users in the system 
- **Feedback** - Review all feedback submitted by users 
- **ML Models** - Manage and view all machine learning models 
- **Prediction Logs** - Analyze prediction logs from all users 
- **Admin Profile** - Manage administrative settings

### For Standard Users
- **User Profile** - Manage your personal profile
- **Submit Feedback** - Send feedback about the platform
- **Create Model** - Build and deploy prediction models
- **View Your Data** - Access your personal data


## Stack Technologique

### Frontend
- **Next.js 16** - React framework with App Router  
- **React 19.2** - Latest version of React  
- **TypeScript** - Full static typing  
- **Tailwind CSS v4** - Modern utility-first styling  
- **shadcn/ui** - Premium UI components  
- **Lucide Icons** - Modern and elegant icons  
- **React Hook Form** - Optimized form management  


## Project Structure

```bash
churn-prediction/
├── app/
│   ├── auth/
│   │   ├── register/
│   │   │   └── page.tsx              
│   │   └── login/
│   │       └── page.tsx              
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── page.tsx              
│   │   └── user/
│   │       └── page.tsx         
│   ├── layout.tsx                    
│   └── globals.css                  
├── components/
│   ├── ui/                           
│   ├── admin/
│   │   ├── admin-header.tsx          
│   │   ├── users-list.tsx            
│   │   ├── feedback-list.tsx         
│   │   ├── models-list.tsx           
│   │   └── logs-list.tsx            
│   └── user/
│       ├── user-header.tsx          
│       ├── user-profile.tsx          
│       ├── create-feedback.tsx      
│       └── create-model.tsx          
├── lib/
│   ├── api-client.ts                 
│   └── auth.ts                      
├── public/                         
├── .env.local                     
├── package.json                     
├── tsconfig.json                     
└── next.config.mjs                  

```



###  Installation 

```bash
npm install
```
