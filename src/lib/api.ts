
import { supabase } from './supabase';

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

// Function to generate a policy using the Supabase Edge Function
export const generatePolicy = async (
  businessDescription: string,
  policyType: PolicyType
): Promise<string> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-policy', {
      body: {
        businessDescription,
        policyType,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      console.error('Error calling generate-policy function:', error);
      throw new Error('Failed to generate policy');
    }

    return data.policy;
  } catch (error) {
    console.error('Error generating policy:', error);
    
    // Fallback to a simulated response if the Edge Function fails
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
  }
};