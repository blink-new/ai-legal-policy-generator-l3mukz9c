
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Label } from './components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { Loader2, Copy, Download, FileText, Shield, Scale, Sparkles } from 'lucide-react'
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
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              AI Legal Policy Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Generate professional legal policies for your business in seconds using AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-indigo-100 dark:border-indigo-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 opacity-50 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-400 flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription className="text-base">
                Provide details about your business to generate a tailored legal policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="space-y-2">
                <Label htmlFor="policy-type" className="text-base">Policy Type</Label>
                <Select value={policyType} onValueChange={(value) => setPolicyType(value as PolicyType)}>
                  <SelectTrigger id="policy-type" className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        <div className="flex items-center gap-2">
                          {policy.icon}
                          <span>{policy.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-description" className="text-base">Business Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Describe your business, products, services, and how you collect and use customer data..."
                  className="min-h-[250px] resize-y bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  The more details you provide, the more accurate and tailored your policy will be.
                </p>
              </div>
            </CardContent>
            <CardFooter className="relative">
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6"
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

          <Card className="shadow-xl border-indigo-100 dark:border-indigo-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 opacity-50 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-400 flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Generated Policy
              </CardTitle>
              <CardDescription className="text-base">
                Your legal policy will appear here after generation
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-md p-6 min-h-[350px] max-h-[500px] overflow-y-auto shadow-inner">
                {generatedPolicy ? (
                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {generatedPolicy}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Your generated policy will appear here</p>
                      <p className="text-sm mt-2 max-w-xs mx-auto">
                        Fill in your business details and click "Generate Policy" to create your legal document
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 relative">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!generatedPolicy}
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={downloadPolicy}
                disabled={!generatedPolicy}
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-indigo-100/50 dark:bg-indigo-950/50 p-1">
              <TabsTrigger value="about" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">About</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Features</TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg mt-2">
              <h3 className="text-xl font-medium mb-3 text-indigo-700 dark:text-indigo-400">About This Tool</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI Legal Policy Generator helps businesses create professional legal documents
                quickly and easily. Simply describe your business and our AI will generate a tailored
                legal policy that meets common requirements. This tool uses advanced AI technology to
                analyze your business description and create appropriate legal language for your specific needs.
              </p>
            </TabsContent>
            <TabsContent value="features" className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg mt-2">
              <h3 className="text-xl font-medium mb-3 text-indigo-700 dark:text-indigo-400">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <li className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3 mt-1">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Multiple Policy Types</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate privacy policies, terms of service, and cookie policies</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3 mt-1">
                    <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">AI-Powered</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customized to your specific business needs using advanced AI</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3 mt-1">
                    <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Easy Export</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download in markdown format or copy directly to clipboard</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3 mt-1">
                    <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Fast Generation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create comprehensive legal documents in seconds</p>
                  </div>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="faq" className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg mt-2">
              <h3 className="text-xl font-medium mb-3 text-indigo-700 dark:text-indigo-400">Frequently Asked Questions</h3>
              <div className="space-y-5 text-gray-600 dark:text-gray-300">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Are these policies legally binding?</h4>
                  <p className="text-sm leading-relaxed">
                    The generated policies are meant to serve as a starting point. While our AI creates comprehensive documents based on common legal requirements, we recommend having them reviewed by a legal professional before implementation to ensure they meet your specific legal needs and jurisdiction requirements.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">How detailed should my business description be?</h4>
                  <p className="text-sm leading-relaxed">
                    The more details you provide about your business operations, data collection practices, and services, the more tailored your policy will be. Include information about what customer data you collect, how you use it, third-party services you use, and any specific features of your business that might have legal implications.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Can I edit the generated policy?</h4>
                  <p className="text-sm leading-relaxed">
                    Yes, you can copy the generated policy and edit it as needed to better fit your specific requirements. The downloaded markdown format is particularly easy to edit in any text editor or markdown editor.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">How often should I update my legal policies?</h4>
                  <p className="text-sm leading-relaxed">
                    It's recommended to review and update your legal policies whenever you make significant changes to your business practices, introduce new features that affect data collection or user interactions, or when relevant laws and regulations change. Many businesses review their policies at least annually.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 pt-8">
          <p>© {new Date().getFullYear()} AI Legal Policy Generator. All rights reserved.</p>
          <p className="mt-1">This tool is for informational purposes only and does not constitute legal advice.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  )
}

export default App