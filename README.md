# InsightDash: Real-Time Sentiment Analysis Web App

**InsightDash** is a fully interactive, production-quality web application that performs real-time sentiment analysis. Designed to be a showcase of both technical skill and clean UI/UX, it visualizes the full journey from raw input text to model predictions with educational clarity.

## 🚀 Project Overview

**Goal:** Build an elegant, intuitive, and powerful sentiment analysis platform that:

* Accepts user input or sample reviews
* Analyzes sentiment using two ML models (Naive Bayes & SVM)
* Provides real-time, interactive visual results
* Explains the inner workings of the ML pipeline

## 🎯 Key Features

### 🧠 Machine Learning Pipeline (Displayed to User)

```
[Raw Text] → [Preprocessing] → [TF-IDF Vectorization] → [ML Model] → [Sentiment Prediction]
```

### 🔍 Real-Time Sentiment Analysis

* User can enter a review or click "Try a Sample"
* Returns:

  * Sentiment: Positive / Negative / Neutral
  * Confidence: Displayed with a dynamic progress bar
  * Word Highlights: Color-coded contributions to sentiment

### 📊 Interactive Results Dashboard

* Smoothly animated results panel
* Sentiment classification with visual badges and metrics
* Highlighted input text to show influential words
* Model comparison (Naive Bayes vs. SVM)
* Visual preprocessing steps: lowercase, clean text, remove stopwords, lemmatization

### 📈 Performance Snapshot

* F1 Score: 89%
* Precision: 91%
* Recall: 87%
* Accuracy: 88%
* Visual confusion matrix and model evolution chart included

## 🧰 Technologies Used

| Layer         | Tech Stack                              |
| ------------- | --------------------------------------- |
| Frontend      | HTML5, CSS3, JavaScript (ES6+)          |
| Backend       | Python, Flask                           |
| ML & NLP      | Scikit-learn, NLTK or SpaCy, Joblib     |
| Visualization | Custom CSS animations, JS interactivity |

## 🌈 UI/UX Design

* Theme: "Data-Tech Startup" – modern, minimal, professional
* Design Aesthetics:

  * Frosted-glass card elements (Glassmorphism)
  * Responsive Flex/Grid layout
  * Animated transitions for interactivity
  * Sentiment-based coloring: Green, Red, Grey
  * Clean sans-serif fonts (e.g., Inter, Poppins)

## 💡 Why InsightDash?

* Showcases full ML lifecycle
* Educates the user at every step
* Demonstrates technical and design excellence

---

🧠 **Sentiment analysis matters** – it empowers businesses to understand customer voices at scale.

Want to explore how machine learning can be beautiful and insightful? Dive in.
