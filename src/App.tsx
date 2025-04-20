
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Label } from './components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { Loader2, Copy, Download, FileText, Shield, Scale, Sparkles, CheckCircle2, Lightbulb, Lock, Zap } from 'lucide-react'
import { generatePolicy, type PolicyType } from './lib/api'
import { supabase } from './lib/supabase'

// Policy types
const policyTypes = [
  { id: 'privacy', name: 'Privacy Policy', icon: <Shield className="h-5 w-5" /> },
  { id: 'terms', name: 'Terms of Service', icon: <Scale className="h-5 w-5" /> },
  { id: 'cookies', name: 'Cookie Policy', icon: <FileText className="h-5 w-5" /> },
]

function App() {
  const [businessDescription, setBusinessDescription] = useState('')
  const [policyType, setPolicyType] = useState<PolicyType>('privacy')
  const [generatedPolicy, setGeneratedPolicy] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGeneratePolicy = async () => {
    if (!businessDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description of your business.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const policy = await generatePolicy(businessDescription, policyType);
      setGeneratedPolicy(policy);
      
      const selectedPolicy = policyTypes.find(p => p.id === policyType);
      const policyName = selectedPolicy ? selectedPolicy.name : 'Policy';
      
      toast({
        title: "Policy Generated",
        description: `Your ${policyName.toLowerCase()} has been successfully generated.`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      console.error('Error generating policy:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPolicy)
    toast({
      title: "Copied to Clipboard",
      description: "Your policy has been copied to the clipboard.",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    })
  }

  const downloadPolicy = () => {
    const selectedPolicy = policyTypes.find(p => p.id === policyType)
    const policyName = selectedPolicy ? selectedPolicy.name : 'Policy'
    const filename = `${policyName.replace(/\s+/g, '-').toLowerCase()}.md`
    
    const element = document.createElement('a')
    const file = new Blob([generatedPolicy], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast({
      title: "Policy Downloaded",
      description: `Your ${policyName.toLowerCase()} has been downloaded as ${filename}.`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 hero-pattern">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <header className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400/20 dark:bg-purple-600/30 rounded-full blur-xl animate-pulse-glow"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text tracking-tight">
            AI Legal Policy Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-xl mt-4 leading-relaxed">
            Generate professional legal policies for your business in seconds using AI
          </p>
          <div className="flex justify-center mt-8 gap-2">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Lock className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Legally Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Easy to Use</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-xl border-0 overflow-hidden card-hover-effect relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="card-decoration card-decoration-1"></div>
            <div className="card-decoration card-decoration-2"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  Business Information
                </CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Provide details about your business to generate a tailored legal policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10 pt-2">
              <div className="space-y-3">
                <Label htmlFor="policy-type" className="text-base font-medium">Policy Type</Label>
                <Select value={policyType} onValueChange={(value) => setPolicyType(value as PolicyType)}>
                  <SelectTrigger id="policy-type" className="w-full bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-900/50 shadow-sm input-focus-ring">
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-900/50">
                    {policyTypes.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id} className="focus:bg-purple-50 dark:focus:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <div className="text-purple-600 dark:text-purple-400">
                            {policy.icon}
                          </div>
                          <span>{policy.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="business-description" className="text-base font-medium">Business Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Describe your business, products, services, and how you collect and use customer data..."
                  className="min-h-[250px] resize-y bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-900/50 shadow-sm input-focus-ring"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>The more details you provide, the more accurate and tailored your policy will be.</span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 rounded-xl shadow-lg transition-all duration-300 button-glow"
                onClick={handleGeneratePolicy}
                disabled={isGenerating || !businessDescription.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Policy...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Policy
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-xl border-0 overflow-hidden card-hover-effect relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="card-decoration card-decoration-1"></div>
            <div className="card-decoration card-decoration-2"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  Generated Policy
                </CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Your legal policy will appear here after generation
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 min-h-[350px] max-h-[500px] overflow-y-auto shadow-inner border border-indigo-100 dark:border-indigo-900/50">
                {generatedPolicy ? (
                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {generatedPolicy}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <div className="text-center max-w-xs">
                      <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-indigo-400/20 dark:bg-indigo-600/30 rounded-full blur-xl"></div>
                        <div className="relative flex items-center justify-center h-full">
                          <FileText className="h-16 w-16 text-indigo-300 dark:text-indigo-700 animate-float" />
                        </div>
                      </div>
                      <p className="text-lg font-medium mb-3">Your generated policy will appear here</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fill in your business details and click "Generate Policy" to create your legal document
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 relative z-10 pt-4">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!generatedPolicy}
                className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={downloadPolicy}
                disabled={!generatedPolicy}
                className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mb-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-gray-100/80 dark:bg-gray-900/80 p-1 rounded-t-2xl">
              {["about", "features", "faq"].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  className="py-3 capitalize font-medium text-gray-600 dark:text-gray-400 tab-transition data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="about" className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">About This Tool</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Our AI Legal Policy Generator helps businesses create professional legal documents
                quickly and easily. Simply describe your business and our AI will generate a tailored
                legal policy that meets common requirements. This tool uses advanced AI technology to
                analyze your business description and create appropriate legal language for your specific needs.
              </p>
              <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-800/50 p-2 rounded-lg mt-1">
                    <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-1">Pro Tip</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      While our generator creates comprehensive policies, we recommend having them reviewed by a legal professional
                      to ensure they meet your specific legal needs and jurisdiction requirements.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
                    title: "Multiple Policy Types",
                    description: "Generate privacy policies, terms of service, and cookie policies tailored to your business needs"
                  },
                  {
                    icon: <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                    title: "AI-Powered Generation",
                    description: "Customized to your specific business using advanced AI language models"
                  },
                  {
                    icon: <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                    title: "Easy Export Options",
                    description: "Download in markdown format or copy directly to clipboard for immediate use"
                  },
                  {
                    icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
                    title: "Fast Generation",
                    description: "Create comprehensive legal documents in seconds, not hours or days"
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-2">{feature.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="faq" className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {[
                  {
                    question: "Are these policies legally binding?",
                    answer: "The generated policies are meant to serve as a starting point. While our AI creates comprehensive documents based on common legal requirements, we recommend having them reviewed by a legal professional before implementation to ensure they meet your specific legal needs and jurisdiction requirements."
                  },
                  {
                    question: "How detailed should my business description be?",
                    answer: "The more details you provide about your business operations, data collection practices, and services, the more tailored your policy will be. Include information about what customer data you collect, how you use it, third-party services you use, and any specific features of your business that might have legal implications."
                  },
                  {
                    question: "Can I edit the generated policy?",
                    answer: "Yes, you can copy the generated policy and edit it as needed to better fit your specific requirements. The downloaded markdown format is particularly easy to edit in any text editor or markdown editor."
                  },
                  {
                    question: "How often should I update my legal policies?",
                    answer: "It's recommended to review and update your legal policies whenever you make significant changes to your business practices, introduce new features that affect data collection or user interactions, or when relevant laws and regulations change. Many businesses review their policies at least annually."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-3">{faq.question}</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-8 pb-4">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <p className="font-medium text-purple-600 dark:text-purple-400">AI Legal Policy Generator</p>
            </div>
            <p>© {new Date().getFullYear()} AI Legal Policy Generator. All rights reserved.</p>
            <p className="mt-1 text-sm">This tool is for informational purposes only and does not constitute legal advice.</p>
            <div className="flex justify-center space-x-6 mt-6">
              {["Terms", "Privacy", "Contact"].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  )
}

export default App