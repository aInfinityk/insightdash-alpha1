
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface PredictionResult {
  final_prediction: string;
  final_confidence: number;
  baseline_prediction: string;
  baseline_confidence: number;
  highlighted_text: Array<[string, number]>;
  preprocessing_steps: {
    original: string;
    lowercase: string;
    no_special_chars: string;
    no_stopwords: string;
    lemmatized: string;
  };
}

interface PerformanceMetrics {
  f1_score: number;
  precision: number;
  recall: number;
  accuracy: number;
  confusion_matrix: number[][];
}

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Mock performance metrics (would come from your ML model in production)
  const performanceMetrics: PerformanceMetrics = {
    f1_score: 89,
    precision: 91,
    recall: 87,
    accuracy: 88,
    confusion_matrix: [[450, 30, 20], [35, 440, 25], [15, 20, 465]]
  };

  const sampleReviews = [
    "This product is absolutely amazing! Fast shipping, great quality, and excellent customer service. Highly recommended!",
    "Terrible experience. The product broke after just one week and customer support was unhelpful. Complete waste of money.",
    "The product is okay. It works as expected but nothing special. Average quality for the price point.",
    "Outstanding! This exceeded all my expectations. The build quality is phenomenal and it arrived earlier than expected.",
    "Very disappointed. The description was misleading and the product doesn't match what was advertised online."
  ];

  const mockPredict = async (text: string): Promise<PredictionResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock sentiment analysis based on simple keyword detection
    const positiveWords = ['amazing', 'excellent', 'outstanding', 'great', 'fantastic', 'wonderful', 'love', 'perfect', 'awesome'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointed', 'broken', 'useless', 'waste'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) score += 1;
      if (negativeWords.some(nw => word.includes(nw))) score -= 1;
    });
    
    let sentiment = 'Neutral';
    let confidence = 0.75;
    
    if (score > 0) {
      sentiment = 'Positive';
      confidence = Math.min(0.95, 0.75 + score * 0.1);
    } else if (score < 0) {
      sentiment = 'Negative';
      confidence = Math.min(0.95, 0.75 + Math.abs(score) * 0.1);
    }
    
    // Generate highlighted text with mock importance scores
    const highlighted_text: Array<[string, number]> = words.map(word => {
      if (positiveWords.some(pw => word.includes(pw))) return [word, Math.random() * 0.5 + 0.5];
      if (negativeWords.some(nw => word.includes(nw))) return [word, -(Math.random() * 0.5 + 0.5)];
      return [word, (Math.random() - 0.5) * 0.3];
    });
    
    return {
      final_prediction: sentiment,
      final_confidence: confidence,
      baseline_prediction: sentiment,
      baseline_confidence: confidence - 0.15,
      highlighted_text,
      preprocessing_steps: {
        original: text,
        lowercase: text.toLowerCase(),
        no_special_chars: text.toLowerCase().replace(/[^\w\s]/g, ''),
        no_stopwords: text.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(word => 
          !['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'were', 'been', 'be'].includes(word)
        ).join(' '),
        lemmatized: text.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(word => 
          !['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'were', 'been', 'be'].includes(word)
        ).join(' ')
      }
    };
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a review to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);
    
    try {
      const result = await mockPredict(inputText);
      setResults(result);
      setShowResults(true);
      
      toast({
        title: "Analysis Complete",
        description: `Sentiment: ${result.final_prediction} (${Math.round(result.final_confidence * 100)}% confident)`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleReview = () => {
    const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    setInputText(randomReview);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Panel 1: Hero & Pipeline Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            InsightDash
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            An AI-Powered Solution for Understanding Customer Feedback at Scale
          </p>
          
          {/* ML Pipeline Visualization */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl">ML Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center items-center gap-4 text-white">
                <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-400/30">
                  Raw Text
                </div>
                <ArrowDown className="text-blue-400" />
                <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                  Preprocessing
                </div>
                <ArrowDown className="text-purple-400" />
                <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-400/30">
                  TF-IDF Vectorization
                </div>
                <ArrowDown className="text-green-400" />
                <div className="bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-400/30">
                  ML Model
                </div>
                <ArrowDown className="text-orange-400" />
                <div className="bg-red-500/20 px-4 py-2 rounded-lg border border-red-400/30">
                  Sentiment Prediction
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel 2: Live Analyzer */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Live Sentiment Analyzer</CardTitle>
            <CardDescription className="text-gray-300">
              Enter a product review or customer feedback to analyze its sentiment in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter a product review here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              disabled={isAnalyzing}
            />
            <div className="flex gap-4">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSampleReview}
                disabled={isAnalyzing}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Try a Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel 3: Dynamic Results Dashboard */}
        {showResults && results && (
          <div className="animate-fade-in space-y-6 mb-8">
            {/* Top-Level Result */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={`${getSentimentColor(results.final_prediction)} text-white px-4 py-2 text-lg`}>
                      {results.final_prediction}
                    </Badge>
                    <div className="text-white">
                      <div className="text-2xl font-bold">
                        {Math.round(results.final_confidence * 100)}% Confident
                      </div>
                      <div className="text-gray-300 text-sm">Final Model Prediction</div>
                    </div>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="w-48">
                    <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${getSentimentColor(results.final_prediction)}`}
                        style={{ width: `${results.final_confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Highlighted Text */}
                <div className="space-y-2">
                  <h3 className="text-white text-lg font-semibold">Sentiment Highlighting</h3>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-white leading-relaxed">
                      {results.highlighted_text.map(([word, score], index) => (
                        <span 
                          key={index}
                          className={`mr-1 px-1 rounded ${
                            score > 0.3 ? 'bg-green-500/30 text-green-200' :
                            score < -0.3 ? 'bg-red-500/30 text-red-200' :
                            'text-gray-300'
                          }`}
                          title={`Impact: ${score > 0 ? '+' : ''}${score.toFixed(2)}`}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preprocessing Steps */}
                <div className="space-y-2">
                  <h3 className="text-white text-lg font-semibold">How It Works - Text Preprocessing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-black/20 p-3 rounded">
                      <span className="text-blue-400 font-medium">Original:</span>
                      <span className="text-white ml-2">{results.preprocessing_steps.original}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded">
                      <span className="text-purple-400 font-medium">Lowercase:</span>
                      <span className="text-white ml-2">{results.preprocessing_steps.lowercase}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded">
                      <span className="text-green-400 font-medium">Remove Special Chars:</span>
                      <span className="text-white ml-2">{results.preprocessing_steps.no_special_chars}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded">
                      <span className="text-orange-400 font-medium">Remove Stopwords:</span>
                      <span className="text-white ml-2">{results.preprocessing_steps.no_stopwords}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded">
                      <span className="text-red-400 font-medium">Lemmatized:</span>
                      <span className="text-white ml-2">{results.preprocessing_steps.lemmatized}</span>
                    </div>
                  </div>
                </div>

                {/* Model Comparison */}
                <div className="space-y-2">
                  <h3 className="text-white text-lg font-semibold">Model Comparison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-lg">
                      <div className="text-gray-300 text-sm">Baseline (Naive Bayes)</div>
                      <div className={`font-bold ${getSentimentTextColor(results.baseline_prediction)}`}>
                        {results.baseline_prediction}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {Math.round(results.baseline_confidence * 100)}% Confident
                      </div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg border-2 border-blue-500/50">
                      <div className="text-gray-300 text-sm">Final Model (SVM)</div>
                      <div className={`font-bold ${getSentimentTextColor(results.final_prediction)}`}>
                        {results.final_prediction}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {Math.round(results.final_confidence * 100)}% Confident
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Panel 4: Performance & Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Model Performance</CardTitle>
              <CardDescription className="text-gray-300">
                Key metrics from our trained sentiment analysis model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-black/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">{performanceMetrics.f1_score}%</div>
                  <div className="text-gray-300">F1-Score</div>
                </div>
                <div className="text-center bg-black/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{performanceMetrics.precision}%</div>
                  <div className="text-gray-300">Precision</div>
                </div>
                <div className="text-center bg-black/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">{performanceMetrics.recall}%</div>
                  <div className="text-gray-300">Recall</div>
                </div>
                <div className="text-center bg-black/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-400">{performanceMetrics.accuracy}%</div>
                  <div className="text-gray-300">Accuracy</div>
                </div>
              </div>

              {/* Model Evolution */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-semibold">Model Evolution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <span className="text-gray-300">Baseline (Naive Bayes)</span>
                    <span className="text-yellow-400 font-bold">78% F1-Score</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <span className="text-gray-300">+ Enhanced Preprocessing</span>
                    <span className="text-blue-400 font-bold">84% F1-Score</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded border-2 border-green-500/50">
                    <span className="text-white font-medium">Final Model (SVM)</span>
                    <span className="text-green-400 font-bold">89% F1-Score</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Methodology & Approach</CardTitle>
              <CardDescription className="text-gray-300">
                Technical details behind our sentiment analysis solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">The Problem</h3>
                <p className="text-gray-300 text-sm">
                  Understanding customer sentiment at scale is crucial for businesses to make data-driven decisions, 
                  improve products, and enhance customer satisfaction.
                </p>
              </div>

              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Our Approach</h3>
                <p className="text-gray-300 text-sm">
                  We implemented a robust ML pipeline using TF-IDF vectorization and Support Vector Machines, 
                  with comprehensive preprocessing and a 70/15/15 train/validation/test split methodology.
                </p>
              </div>

              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/50">React</Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">Python</Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/50">Scikit-learn</Badge>
                  <Badge variant="outline" className="text-orange-400 border-orange-400/50">Flask</Badge>
                  <Badge variant="outline" className="text-red-400 border-red-400/50">NLTK</Badge>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">TailwindCSS</Badge>
                </div>
              </div>

              {/* Confusion Matrix */}
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Confusion Matrix</h3>
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    <div></div>
                    <div className="text-center text-gray-400">Pos</div>
                    <div className="text-center text-gray-400">Neg</div>
                    <div className="text-center text-gray-400">Neu</div>
                    <div className="text-gray-400">Pos</div>
                    <div className="bg-green-500/30 text-center p-2 rounded text-white">450</div>
                    <div className="bg-red-500/20 text-center p-2 rounded text-white">30</div>
                    <div className="bg-gray-500/20 text-center p-2 rounded text-white">20</div>
                    <div className="text-gray-400">Neg</div>
                    <div className="bg-red-500/20 text-center p-2 rounded text-white">35</div>
                    <div className="bg-green-500/30 text-center p-2 rounded text-white">440</div>
                    <div className="bg-gray-500/20 text-center p-2 rounded text-white">25</div>
                    <div className="text-gray-400">Neu</div>
                    <div className="bg-red-500/20 text-center p-2 rounded text-white">15</div>
                    <div className="bg-red-500/20 text-center p-2 rounded text-white">20</div>
                    <div className="bg-green-500/30 text-center p-2 rounded text-white">465</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
