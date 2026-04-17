# Job Search Personalizer

A clean, presentation-ready frontend interface that simulates an Information Retrieval (IR) and NLP-based job recommendation system. 

It takes a user's resume as a "Query" and returns ranked job postings as "Documents" based on mock similarity scoring. 

## How to Run Locally

Because this frontend is built purely with vanilla HTML, CSS, and JavaScript, it is extremely easy to run. **No build steps or Node.js installations are required.**

You have three easy options to run it:

### Option 1: The "No Setup" Method (Easiest)
1. Clone or download this repository.
2. Locate the `index.html` file in your file explorer / finder.
3. Simply **double-click** the file to open it in your default web browser (Chrome, Firefox, Safari, etc.).

### Option 2: Using VS Code "Live Server" (Recommended for testing)
1. Open the project folder in **Visual Studio Code**.
2. Install the popular **Live Server** extension by Ritwick Dey if you don't have it.
3. Right-click on `index.html` and select **"Open with Live Server"**. 
4. A browser window will automatically open and refresh whenever you make code changes.

### Option 3: Using Python's Built-in Server
If you use the terminal and already have Python installed:
1. Open your terminal and navigate to this folder.
2. Run the following command:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to: `http://localhost:8000`
