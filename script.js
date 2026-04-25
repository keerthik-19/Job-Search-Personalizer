/* 
  ========================================================
  JOB SEARCH PERSONALIZER - JAVASCRIPT LOGIC
  This file handles the interactivity. It listens for button 
  clicks, simulates data processing, and injects job results.
  ======================================================== 
*/

// event listener ensures our HTML is fully loaded before trying to find elements
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GRAB HTML ELEMENTS ---
    // We store these references so we can update the webpage later
    const resumeInput = document.getElementById('resume-input');
    const findJobsBtn = document.getElementById('find-jobs-btn');
    const btnText = findJobsBtn.querySelector('.btn-text');
    const loader = findJobsBtn.querySelector('.loader');
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const jobResultsContainer = document.getElementById('job-results');

    // --- 2. BACKEND CONFIG ---
    const API_URL = 'http://localhost:8080/recommend';

    // --- 3. HANDLE BUTTON CLICK EVENT ---
    findJobsBtn.addEventListener('click', async () => {
        // Step A: Check if the user actually typed a resume. 
        // If empty (.trim() removes accidental spaces), stop and focus the box.
        if (!resumeInput.value.trim()) {
            resumeInput.focus();
            return;
        }

        // Step B: Simulate the "Processing/Loading" state
        findJobsBtn.disabled = true;                // Prevent double clicking
        btnText.classList.add('hidden');            // Hide the text "Find Jobs"
        loader.classList.remove('hidden');          // Show the spinning circle
        
        jobResultsContainer.classList.add('hidden'); // Hide any previous job results
        resultsPlaceholder.style.display = 'flex';   // Show "Awaiting input..." 

        // Step C: Call backend endpoint with resume text
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume_text: resumeInput.value.trim(),
                    top_n: 5
                })
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            const jobs = normalizeJobs(data.results);

            // Revert button state
            findJobsBtn.disabled = false;
            loader.classList.add('hidden');
            btnText.classList.remove('hidden');

            // Hide placeholder and render jobs
            resultsPlaceholder.style.display = 'none';
            renderJobs(jobs);
            jobResultsContainer.classList.remove('hidden');
        } catch (error) {
            findJobsBtn.disabled = false;
            loader.classList.add('hidden');
            btnText.classList.remove('hidden');

            const safeApiUrl = API_URL.replace(/"/g, '&quot;');
            resultsPlaceholder.innerHTML = `<p>Could not fetch results from ${safeApiUrl}. Check backend host/port and that /recommend is reachable.</p>`;
            resultsPlaceholder.style.display = 'flex';
            console.error('Recommendation request failed:', error);
        }
    });

    // Convert backend response shape into existing UI shape
    function normalizeJobs(results) {
        if (!Array.isArray(results)) return [];
        return results.map(job => {
            const title = job.title || 'Untitled Role';
            const company = job.company_name || 'Unknown Company';
            const location = job.location || 'Remote/Unspecified';
            const score = typeof job.score === 'number' ? job.score : 0;
            return {
                title,
                description: `${company} | ${location}`,
                matchScore: score,
                keywords: []
            };
        });
    }

    // --- 4. RENDER FUNCTION ---
    // Takes array of job objects and builds HTML cards for each
    function renderJobs(jobs) {
        // Clear out any old results inside the container first
        jobResultsContainer.innerHTML = ''; 
        if (!jobs.length) {
            resultsPlaceholder.innerHTML = '<p>No matching jobs found.</p>';
            resultsPlaceholder.style.display = 'flex';
            return;
        }
        
        // Loop through every single job object in our mock data
        jobs.forEach((job, index) => {
            
            // Create a brand new "div" element to act as our card
            const card = document.createElement('div');
            card.className = 'job-card';
            
            // If it is the first job (index 0), mark it as the top match!
            const isTopMatch = index === 0;
            if (isTopMatch) {
                card.classList.add('top-match'); // Adds the peach border CSS
            }
            
            // Feature: Highlight matched keywords dynamically
            let highlightedDesc = job.description;
            if (job.keywords) {
                // Loop through our keywords and wrap them in a <span> tag
                job.keywords.forEach(kw => {
                    // Regular Expression: finds the word exactly, ignoring case (/gi)
                    const regex = new RegExp(`(${kw})`, 'gi');
                    highlightedDesc = highlightedDesc.replace(regex, `<span class="keyword-highlight">$1</span>`);
                });
            }
            
            // Inject the actual HTML content inside this specific card
            // Utilizing template literals (` `) so we can insert variables easily via ${}
            card.innerHTML = `
                ${isTopMatch ? '<div class="top-match-label">★ Top Match</div>' : ''}
                <div class="job-header">
                    <div class="job-title">${job.title}</div>
                    <div class="job-match-score">Score: ${(job.matchScore * 100).toFixed(0)}%</div>
                </div>
                <div class="job-desc">${highlightedDesc}</div>
                <div style="margin-top: 1rem; text-align: right;">
                    <span style="color: var(--accent-peach); font-weight: 500; font-size: 0.95rem;">View & Apply →</span>
                </div>
            `;
            
            // Make the entire card clickable to see details
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                // Save this job to localStorage so the next page can read it
                localStorage.setItem('selectedJob', JSON.stringify(job));
                // Navigate to the job details page
                window.location.href = 'job-details.html';
            });
            
            // Stick this completed HTML card into the actual webpage container!
            jobResultsContainer.appendChild(card);
        });
    }
});
