const http = require("http");

const PORT = 8000;

// Job data
const jobs = [
    {
        id: 1,
        title: "Data Analyst",
        experience: 1,
        skills: ["python", "sql", "power bi", "excel"]
    },
    {
        id: 2,
        title: "Senior React Developer",
        experience: 3,
        skills: ["react", "node.js", "mongodb", "rest api"]
    },
    {
        id: 3,
        title: "Backend Developer",
        experience: 2,
        skills: ["python", "api", "postgresql", "sql"]
    }
];

// Candidate data
const candidates = [
    {
        id: 1,
        name: "Ananya Sharma",
        experience: 3,
        skills: ["react", "node.js", "mongodb", "rest api"]
    },
    {
        id: 2,
        name: "Rahul Kumar",
        experience: 2,
        skills: ["python", "sql", "power bi", "excel"]
    },
    {
        id: 3,
        name: "Priya Singh",
        experience: 4,
        skills: ["react", "javascript", "html", "css"]
    },
    {
        id: 4,
        name: "Vikram Kumar",
        experience: 3,
        skills: ["python", "api", "postgresql", "sql"]
    }
];

// AI-style matching logic
function calculateMatch(candidate, job) {

    const matchedSkills = job.skills.filter(skill =>
        candidate.skills.includes(skill)
    );

    const missingSkills = job.skills.filter(skill =>
        !candidate.skills.includes(skill)
    );

    // Skills = 70%
    const skillScore =
        (matchedSkills.length / job.skills.length) * 70;

    // Experience = 30%
    const experienceScore =
        Math.min(candidate.experience / job.experience, 1) * 30;

    const score = Math.round(skillScore + experienceScore);

    let recommendation;

    if (score >= 85) {
        recommendation = "Strong Match - Recommended for Interview";
    } else if (score >= 70) {
        recommendation = "Good Match - Consider for Interview";
    } else if (score >= 50) {
        recommendation = "Moderate Match - Review Skill Gaps";
    } else {
        recommendation = "Low Match - Not Recommended Currently";
    }

    return {
        candidate: candidate.name,
        job: job.title,
        matchScore: score,
        matchedSkills: matchedSkills,
        skillGaps: missingSkills,
        experience: candidate.experience,
        recommendation: recommendation
    };
}


// Create server
const server = http.createServer((req, res) => {

    // Allow frontend requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");


    // Get all jobs
    if (req.method === "GET" && req.url === "/api/jobs") {

        res.writeHead(200);
        res.end(JSON.stringify(jobs));

        return;
    }


    // Get all candidates
    if (req.method === "GET" && req.url === "/api/candidates") {

        res.writeHead(200);
        res.end(JSON.stringify(candidates));

        return;
    }


    // Calculate candidate-job match
    if (req.method === "POST" && req.url === "/api/match") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                const candidate = candidates.find(
                    c => c.id === Number(data.candidateId)
                );

                const job = jobs.find(
                    j => j.id === Number(data.jobId)
                );

                if (!candidate || !job) {

                    res.writeHead(400);

                    res.end(JSON.stringify({
                        error: "Candidate or Job not found"
                    }));

                    return;
                }

                const result = calculateMatch(candidate, job);

                res.writeHead(200);
                res.end(JSON.stringify(result));

            } catch (error) {

                res.writeHead(400);

                res.end(JSON.stringify({
                    error: "Invalid request"
                }));
            }
        });

        return;
    }


    // Server status
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200);

        res.end(JSON.stringify({
            message: "SmartHire AI Backend is running!",
            status: "success"
        }));

        return;
    }


    // Unknown endpoint
    res.writeHead(404);

    res.end(JSON.stringify({
        error: "API endpoint not found"
    }));
});


// Start server
server.listen(PORT, () => {

    console.log(
        `SmartHire AI Backend running at http://localhost:${PORT}`
    );

});