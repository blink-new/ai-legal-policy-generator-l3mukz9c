
import axios from 'axios';

// Define policy types
export type PolicyType = 'privacy' | 'terms' | 'cookies';

// Interface for the generate policy request
export interface GeneratePolicyRequest {
  businessDescription: string;
  policyType: PolicyType;
}

// Interface for the generate policy response
export interface GeneratePolicyResponse {
  policy: string;
}

// Function to generate a policy using the API
export const generatePolicy = async (
  businessDescription: string,
  policyType: PolicyType
): Promise<string> => {
  try {
    // In a production environment, this would call a backend API
    // For now, we'll use a simulated response with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const policyTypeNames = {
          privacy: 'Privacy Policy',
          terms: 'Terms of Service',
          cookies: 'Cookie Policy'
        };
        
        const policyName = policyTypeNames[policyType];
        
        const policy = `# ${policyName} for Your Business

This ${policyName.toLowerCase()} is generated based on the following business description:

"${businessDescription}"

## 1. Introduction

Welcome to our service. This document outlines how we collect, use, and protect your information.

## 2. Information Collection

We collect information that you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support.

## 3. Use of Information

We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and users.

## 4. Information Sharing

We do not share your personal information with companies, organizations, or individuals outside of our company except in the following cases: with your consent, with domain administrators, for legal reasons, or in case of a merger or acquisition.

## 5. Security

We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.

## 6. Changes

Our ${policyName.toLowerCase()} may change from time to time. We will post any privacy policy changes on this page.

## 7. Contact Us

If you have any questions about our ${policyName.toLowerCase()}, please contact us.`;
        
        resolve(policy);
      }, 2000);
    });
  } catch (error) {
    console.error('Error generating policy:', error);
    throw new Error('Failed to generate policy');
  }
};

// In a real implementation, we would connect to OpenAI API like this:
/*
export const generatePolicyWithOpenAI = async (
  businessDescription: string,
  policyType: PolicyType
): Promise<string> => {
  try {
    const policyTypeNames = {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy'
    };
    
    const policyName = policyTypeNames[policyType];
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
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
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating policy with OpenAI:', error);
    throw new Error('Failed to generate policy');
  }
};
*/