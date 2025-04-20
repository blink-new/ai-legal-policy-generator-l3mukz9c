
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Label } from './components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { Loader2, Copy, Download, FileText, Shield, Scale } from 'lucide-react'
import { generatePolicy, type PolicyType } from './lib/api'

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
            AI Legal Policy Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate professional legal policies for your business in seconds using AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-indigo-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-700 dark:text-indigo-400">
                Business Information
              </CardTitle>
              <CardDescription>
                Provide details about your business to generate a tailored legal policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select value={policyType} onValueChange={(value) => setPolicyType(value as PolicyType)}>
                  <SelectTrigger id="policy-type" className="w-full">
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
                <Label htmlFor="business-description">Business Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Describe your business, products, services, and how you collect and use customer data..."
                  className="min-h-[200px] resize-y"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleGeneratePolicy}
                disabled={isGenerating || !businessDescription.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Policy'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-indigo-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-700 dark:text-indigo-400">
                Generated Policy
              </CardTitle>
              <CardDescription>
                Your legal policy will appear here after generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                {generatedPolicy ? (
                  <div className="prose prose-indigo dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {generatedPolicy}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Your generated policy will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!generatedPolicy}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={downloadPolicy}
                disabled={!generatedPolicy}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="p-4 bg-white dark:bg-gray-800 rounded-md shadow mt-2">
              <h3 className="text-lg font-medium mb-2">About This Tool</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI Legal Policy Generator helps businesses create professional legal documents
                quickly and easily. Simply describe your business and our AI will generate a tailored
                legal policy that meets common requirements.
              </p>
            </TabsContent>
            <TabsContent value="features" className="p-4 bg-white dark:bg-gray-800 rounded-md shadow mt-2">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Generate multiple types of legal policies</li>
                <li>Customized to your specific business needs</li>
                <li>Download in markdown format</li>
                <li>Copy directly to clipboard</li>
                <li>Fast and easy to use</li>
              </ul>
            </TabsContent>
            <TabsContent value="faq" className="p-4 bg-white dark:bg-gray-800 rounded-md shadow mt-2">
              <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-medium">Are these policies legally binding?</h4>
                  <p className="text-sm">
                    The generated policies are meant to serve as a starting point. We recommend having them reviewed by a legal professional before implementation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">How detailed should my business description be?</h4>
                  <p className="text-sm">
                    The more details you provide about your business operations, data collection practices, and services, the more tailored your policy will be.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Can I edit the generated policy?</h4>
                  <p className="text-sm">
                    Yes, you can copy the generated policy and edit it as needed to better fit your specific requirements.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AI Legal Policy Generator. All rights reserved.</p>
          <p className="mt-1">This tool is for informational purposes only and does not constitute legal advice.</p>
        </footer>
      </div>
      <Toaster />
    </div>
  )
}

export default App