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

    // --- 2. MOCK DATA (Simulated AI Results) ---
    // In a real project, this array would be returned by an API call to your Python backend
    // after it runs TF-IDF/Word2Vec and Cosine Similarity!
    const mockJobs = [
        {
            title: "Data Analyst",
            description: "Analyze vast data sets and guide critical business decisions. Work with cross-functional teams.",
            matchScore: 0.89,
            keywords: ["data sets", "business"] // Terms our system "thinks" are strong matches
        },
        {
            title: "Software Engineer",
            description: "Build, design, and maintain scalable software applications for enterprise clients.",
            matchScore: 0.82,
            keywords: ["software", "applications"]
        },
        {
            title: "ML Intern",
            description: "Assist in developing machine learning models and pipelines for text analysis.",
            matchScore: 0.76,
            keywords: ["machine learning", "models"]
        },
        {
            title: "Product Manager",
            description: "Drive product strategy and coordinate engineering delivery timelines.",
            matchScore: 0.65,
            keywords: ["product", "strategy"]
        }
    ];

    // --- 3. HANDLE BUTTON CLICK EVENT ---
    findJobsBtn.addEventListener('click', () => {
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

        // Step C: Artificial Delay
        // We use setTimeout to pretend the AI model is calculating similarity vectors for 1.2 seconds
        setTimeout(() => {
            
            // Revert the button to its normal state
            findJobsBtn.disabled = false;
            loader.classList.add('hidden');
            btnText.classList.remove('hidden');

            // Hide the "Awaiting input..." text now that we have data!
            resultsPlaceholder.style.display = 'none';
            
            // Trigger the function that draws the jobs onto the screen
            renderJobs(mockJobs);
            
            // Actually reveal the container holding the new jobs
            jobResultsContainer.classList.remove('hidden');

        }, 1200); // 1200 milliseconds = 1.2 seconds
    });

    // --- 4. RENDER FUNCTION ---
    // Takes array of job objects and builds HTML cards for each
    function renderJobs(jobs) {
        // Clear out any old results inside the container first
        jobResultsContainer.innerHTML = ''; 
        
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
            `;
            
            // Stick this completed HTML card into the actual webpage container!
            jobResultsContainer.appendChild(card);
        });
    }
});
