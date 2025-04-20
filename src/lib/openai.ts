
import OpenAI from 'openai';
import { PolicyType } from './api';

// This is a placeholder for the actual OpenAI integration
// In a real application, you would need to set up a server with proper API key handling

export const generatePolicyWithOpenAI = async (
  businessDescription: string,
  policyType: PolicyType,
  apiKey: string
): Promise<string> => {
  try {
    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const policyTypeNames = {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy'
    };
    
    const policyName = policyTypeNames[policyType];
    
    // Create the prompt for the policy generation
    const prompt = `
    You are a legal document generator. Create a professional ${policyName} based on the business description provided.
    Format the response in markdown with proper sections and headings.
    
    Business Description: ${businessDescription}
    
    Generate a comprehensive ${policyName} that covers all necessary legal aspects for this business.
    `;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a legal document generator. Create a professional ${policyName} based on the business description provided. Format the response in markdown with proper sections and headings.`
        },
        {
          role: 'user',
          content: `Generate a ${policyName} for the following business: ${businessDescription}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Extract the generated policy from the response
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating policy with OpenAI:', error);
    throw new Error('Failed to generate policy with OpenAI');
  }
};