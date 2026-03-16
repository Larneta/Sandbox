const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];


function getLearnerData(course, ag, submissions) {
    try {

        if (ag.course_id !== course.id) {
            throw new Error("Invalid Input: Assignment Group does not belong to the specified course.");
        }

        const now = new Date();
        const learnerData = {};


        submissions.forEach(sub => {
            const assignment = ag.assignments.find(a => a.id === sub.assignment_id);


            if (!assignment) return;

            const dueDate = new Date(assignment.due_at);
            const subDate = new Date(sub.submission.submitted_at);


            if (dueDate > now) return;


            const pointsPossible = Number(assignment.points_possible);
            if (isNaN(pointsPossible) || pointsPossible === 0) {
                throw new Error(`Invalid points_possible for assignment ${assignment.id}.`);
            }

            let score = Number(sub.submission.score);
            if (subDate > dueDate) {
                score -= (pointsPossible * 0.1);
            }


            if (!learnerData[sub.learner_id]) {
                learnerData[sub.learner_id] = {
                    id: sub.learner_id,
                    totalScore: 0,
                    totalPossible: 0,
                    assignments: {}
                };
            }

            const learner = learnerData[sub.learner_id];
            learner.assignments[assignment.id] = score / pointsPossible;
            learner.totalScore += score;
            learner.totalPossible += pointsPossible;
        });


        return Object.values(learnerData).map(learner => {
            const result = {
                id: learner.id,
                avg: learner.totalScore / learner.totalPossible,
                ...learner.assignments
            };
            return result;
        });

    } catch (error) {
        console.error("Processing Error:", error.message);
        return [];
    }
}

// }

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
