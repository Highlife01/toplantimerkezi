/**
 * Toplantı Merkezi GA4 & GTM Event Tracking Dispatcher
 * Provides standard B2B event dispatching for Google Analytics 4 and Google Tag Manager
 */

// Initialize dataLayer & gtag queue safely if in browser
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  // Inject GA4 script dynamically if GA ID is configured in env
  const gaId = import.meta.env.VITE_GA_ID;
  if (gaId && gaId !== 'G-TOPLANTIMERKEZI' && !document.querySelector(`script[src*="${gaId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: true });
  }
}

export const trackEvent = (eventName, params = {}) => {
  try {
    // 1. Google Tag Manager (dataLayer)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Google Analytics 4 (gtag queue or live function)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 3. Meta Pixel (fbq) if lead or key conversion
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (eventName === 'generate_lead') {
        window.fbq('track', 'Lead', params);
      } else if (eventName === 'quote_form_complete') {
        window.fbq('track', 'SubmitApplication', params);
      }
    }

    // Development logging
    if (import.meta.env.DEV) {
      console.log(`[TM Analytics Event] ${eventName}:`, params);
    }
  } catch (err) {
    console.error('[TM Analytics Error]:', err);
  }
};

// Convenience Event Helpers
export const analytics = {
  quoteFormStart: (orgType, city) => trackEvent('quote_form_start', { organization_type: orgType, city }),
  quoteFormComplete: (leadId, orgType, city, attendees, budget) => trackEvent('quote_form_complete', { lead_id: leadId, organization_type: orgType, city, attendees, budget }),
  generateLead: (leadId, company, city, orgType) => trackEvent('generate_lead', { lead_id: leadId, company, city, organization_type: orgType }),
  phoneClick: (phoneNumber, locationSource) => trackEvent('phone_click', { phone_number: phoneNumber, location_source: locationSource }),
  whatsappClick: (locationSource) => trackEvent('whatsapp_click', { location_source: locationSource }),
  emailClick: (email) => trackEvent('email_click', { email }),
  venueView: (venueId, venueName, city) => trackEvent('venue_view', { venue_id: venueId, venue_name: venueName, city }),
  serviceView: (serviceSlug, serviceName) => trackEvent('service_view', { service_slug: serviceSlug, service_name: serviceName }),
  cityPageView: (citySlug, cityName) => trackEvent('city_page_view', { city_slug: citySlug, city_name: cityName }),
  caseStudyView: (projectSlug, projectTitle) => trackEvent('case_study_view', { project_slug: projectSlug, project_title: projectTitle }),
  formError: (step, errorMessage) => trackEvent('form_error', { form_step: step, error: errorMessage })
};
