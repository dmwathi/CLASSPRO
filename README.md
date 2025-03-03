<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Pro - Attendance & Marks Tracker</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Class Pro</h1>
            <p>Attendance & Marks Tracker</p>
        </header>

        <main>
            <section class="controls">
                <div class="date-selector">
                    <label for="date">Date:</label>
                    <input type="date" id="date" value="">
                </div>
                <div class="class-selector">
                    <label for="class-name">Class:</label>
                    <input type="text" id="class-name" placeholder="Enter class name">
                </div>
                <div class="action-buttons">
                    <button id="add-student-btn" class="btn primary"><i class="fas fa-user-plus"></i> Add Student</button>
                </div>
            </section>

            <section class="student-form hidden" id="student-form">
                <h3>Add New Student</h3>
                <form id="new-student-form">
                    <div class="form-group">
                        <label for="student-id">Student ID:</label>
                        <input type="text" id="student-id" required>
                    </div>
                    <div class="form-group">
                        <label for="student-name">Full Name:</label>
                        <input type="text" id="student-name" required>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn primary">Add</button>
                        <button type="button" id="cancel-add" class="btn danger">Cancel</button>
                    </div>
                </form>
            </section>

            <section class="student-list">
                <div class="list-header">
                    <div class="search-container">
                        <input type="text" id="search-input" placeholder="Search students...">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="view-toggle">
                        <button id="attendance-view" class="btn toggle active">Attendance</button>
                        <button id="marks-view" class="btn toggle">Marks</button>
                    </div>
                </div>

                <div class="table-container">
                    <table id="students-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th id="dynamic-header">Attendance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="students-body">
                            <!-- Student rows will be added here dynamically -->
                        </tbody>
                    </table>
                </div>

                <div class="no-students" id="no-students">
                    <p>No students added yet. Add your first student to get started!</p>
                </div>
            </section>

            <section class="summary">
                <div class="summary-card">
                    <h3>Total Students</h3>
                    <p id="total-students">0</p>
                </div>
                <div class="summary-card" id="attendance-summary">
                    <h3>Present</h3>
                    <p id="present-count">0</p>
                </div>
                <div class="summary-card" id="marks-summary" style="display: none;">
                    <h3>Average Mark</h3>
                    <p id="average-mark">0</p>
                </div>
            </section>
        </main>

        <footer>
            <p>&copy; 2025 Class Pro. All rights reserved.</p>
        </footer>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal" id="confirm-modal">
        <div class="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to remove this student? This action cannot be undone.</p>
            <div class="modal-buttons">
                <button id="confirm-delete" class="btn danger">Delete</button>
                <button id="cancel-delete" class="btn secondary">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Add Mark Modal -->
    <div class="modal" id="add-mark-modal">
        <div class="modal-content">
            <h3>Add New Mark</h3>
            <form id="add-mark-form">
                <div class="form-group">
                    <label for="mark-title">Title/Description:</label>
                    <input type="text" id="mark-title" placeholder="e.g., Quiz 1, Midterm, etc." required>
                </div>
                <div class="form-group">
                    <label for="mark-value">Mark:</label>
                    <input type="number" id="mark-value" min="0" max="100" required>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn primary">Add Mark</button>
                    <button type="button" id="cancel-add-mark" class="btn secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
