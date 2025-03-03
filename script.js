// Initialize date input with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('date').value = formattedDate;
    
    // Load data from localStorage if available
    loadData();
    
    // Update UI
    updateStudentCount();
    updateAttendanceSummary();
    checkForStudents();
});

// Global variables
let students = [];
let currentView = 'attendance';
let studentToDelete = null;
let currentStudentForMark = null;

// DOM Elements
const addStudentBtn = document.getElementById('add-student-btn');
const studentForm = document.getElementById('student-form');
const newStudentForm = document.getElementById('new-student-form');
const cancelAddBtn = document.getElementById('cancel-add');
const studentsTable = document.getElementById('students-table');
const studentsBody = document.getElementById('students-body');
const searchInput = document.getElementById('search-input');
const attendanceViewBtn = document.getElementById('attendance-view');
const marksViewBtn = document.getElementById('marks-view');
const dynamicHeader = document.getElementById('dynamic-header');
const attendanceSummary = document.getElementById('attendance-summary');
const marksSummary = document.getElementById('marks-summary');
const confirmModal = document.getElementById('confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const noStudentsDiv = document.getElementById('no-students');
const addMarkModal = document.getElementById('add-mark-modal');
const addMarkForm = document.getElementById('add-mark-form');
const cancelAddMarkBtn = document.getElementById('cancel-add-mark');

// Event Listeners
addStudentBtn.addEventListener('click', toggleStudentForm);
cancelAddBtn.addEventListener('click', toggleStudentForm);
newStudentForm.addEventListener('submit', addStudent);
searchInput.addEventListener('input', filterStudents);
attendanceViewBtn.addEventListener('click', () => switchView('attendance'));
marksViewBtn.addEventListener('click', () => switchView('marks'));
confirmDeleteBtn.addEventListener('click', confirmDelete);
cancelDeleteBtn.addEventListener('click', closeModal);
addMarkForm.addEventListener('submit', addMark);
cancelAddMarkBtn.addEventListener('click', closeAddMarkModal);

// Toggle student form visibility
function toggleStudentForm() {
    studentForm.classList.toggle('hidden');
    if (!studentForm.classList.contains('hidden')) {
        document.getElementById('student-id').focus();
    } else {
        // Clear form
        newStudentForm.reset();
    }
}

// Add new student
function addStudent(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('student-id').value.trim();
    const studentName = document.getElementById('student-name').value.trim();
    
    // Check if student ID already exists
    if (students.some(student => student.id === studentId)) {
        alert('A student with this ID already exists!');
        return;
    }
    
    const newStudent = {
        id: studentId,
        name: studentName,
        attendance: 'absent',
        marks: []
    };
    
    students.push(newStudent);
    saveData();
    renderStudents();
    updateStudentCount();
    updateAttendanceSummary();
    checkForStudents();
    
    // Hide form and reset
    toggleStudentForm();
}

// Render students table
function renderStudents() {
    // Clear table
    studentsBody.innerHTML = '';
    
    // Filter students based on search
    const searchTerm = searchInput.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.id.toLowerCase().includes(searchTerm) || 
        student.name.toLowerCase().includes(searchTerm)
    );
    
    // Add rows for each student
    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        
        // ID cell
        const idCell = document.createElement('td');
        idCell.textContent = student.id;
        row.appendChild(idCell);
        
        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        // Dynamic cell (attendance or marks)
        const dynamicCell = document.createElement('td');
        if (currentView === 'attendance') {
            const attendanceToggle = document.createElement('div');
            attendanceToggle.className = 'attendance-toggle';
            
            const presentBtn = document.createElement('button');
            presentBtn.className = `btn ${student.attendance === 'present' ? 'success' : 'secondary'}`;
            presentBtn.textContent = 'Present';
            presentBtn.addEventListener('click', () => toggleAttendance(student.id, 'present'));
            
            const absentBtn = document.createElement('button');
            absentBtn.className = `btn ${student.attendance === 'absent' ? 'danger' : 'secondary'}`;
            absentBtn.textContent = 'Absent';
            absentBtn.addEventListener('click', () => toggleAttendance(student.id, 'absent'));
            
            attendanceToggle.appendChild(presentBtn);
            attendanceToggle.appendChild(absentBtn);
            dynamicCell.appendChild(attendanceToggle);
        } else {
            const marksContainer = document.createElement('div');
            marksContainer.className = 'marks-container';
            
            // Display existing marks
            if (student.marks && student.marks.length > 0) {
                const marksList = document.createElement('div');
                marksList.className = 'marks-list';
                
                student.marks.forEach((mark, index) => {
                    const markItem = document.createElement('div');
                    markItem.className = 'mark-item';
                    
                    const markTitle = document.createElement('span');
                    markTitle.className = 'mark-title';
                    markTitle.textContent = mark.title + ': ';
                    
                    const markValue = document.createElement('span');
                    markValue.className = 'mark-value';
                    markValue.textContent = mark.value;
                    
                    const markDelete = document.createElement('i');
                    markDelete.className = 'fas fa-times mark-delete';
                    markDelete.addEventListener('click', () => deleteMark(student.id, index));
                    
                    markItem.appendChild(markTitle);
                    markItem.appendChild(markValue);
                    markItem.appendChild(markDelete);
                    marksList.appendChild(markItem);
                });
                
                marksContainer.appendChild(marksList);
            }
            
            // Add mark button
            const addMarkBtn = document.createElement('button');
            addMarkBtn.className = 'btn primary';
            addMarkBtn.innerHTML = '<i class="fas fa-plus"></i> Add Mark';
            addMarkBtn.addEventListener('click', () => showAddMarkModal(student.id));
            
            marksContainer.appendChild(addMarkBtn);
            dynamicCell.appendChild(marksContainer);
        }
        row.appendChild(dynamicCell);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'action-cell';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => showDeleteConfirmation(student.id));
        
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        studentsBody.appendChild(row);
    });
}

// Toggle attendance status
function toggleAttendance(studentId, status) {
    const studentIndex = students.findIndex(student => student.id === studentId);
    if (studentIndex !== -1) {
        students[studentIndex].attendance = status;
        saveData();
        renderStudents();
        updateAttendanceSummary();
    }
}

// Show add mark modal
function showAddMarkModal(studentId) {
    currentStudentForMark = studentId;
    addMarkModal.style.display = 'flex';
    document.getElementById('mark-title').focus();
}

// Close add mark modal
function closeAddMarkModal() {
    addMarkModal.style.display = 'none';
    addMarkForm.reset();
    currentStudentForMark = null;
}

// Add mark to student
function addMark(e) {
    e.preventDefault();
    
    if (!currentStudentForMark) return;
    
    const markTitle = document.getElementById('mark-title').value.trim();
    const markValue = parseInt(document.getElementById('mark-value').value);
    
    const studentIndex = students.findIndex(student => student.id === currentStudentForMark);
    if (studentIndex !== -1) {
        if (!students[studentIndex].marks) {
            students[studentIndex].marks = [];
        }
        
        students[studentIndex].marks.push({
            title: markTitle,
            value: markValue
        });
        
        saveData();
        renderStudents();
        updateMarksSummary();
        closeAddMarkModal();
    }
}

// Delete mark from student
function deleteMark(studentId, markIndex) {
    const studentIndex = students.findIndex(student => student.id === studentId);
    if (studentIndex !== -1 && students[studentIndex].marks) {
        students[studentIndex].marks.splice(markIndex, 1);
        saveData();
        renderStudents();
        updateMarksSummary();
    }
}

// Switch between attendance and marks view
function switchView(view) {
    currentView = view;
    
    // Update UI
    if (view === 'attendance') {
        attendanceViewBtn.classList.add('active');
        marksViewBtn.classList.remove('active');
        dynamicHeader.textContent = 'Attendance';
        attendanceSummary.style.display = 'block';
        marksSummary.style.display = 'none';
    } else {
        attendanceViewBtn.classList.remove('active');
        marksViewBtn.classList.add('active');
        dynamicHeader.textContent = 'Marks';
        attendanceSummary.style.display = 'none';
        marksSummary.style.display = 'block';
        updateMarksSummary();
    }
    
    renderStudents();
}

// Filter students based on search input
function filterStudents() {
    renderStudents();
}

// Show delete confirmation modal
function showDeleteConfirmation(studentId) {
    studentToDelete = studentId;
    confirmModal.style.display = 'flex';
}

// Close modal
function closeModal() {
    confirmModal.style.display = 'none';
    studentToDelete = null;
}

// Confirm student deletion
function confirmDelete() {
    if (studentToDelete) {
        students = students.filter(student => student.id !== studentToDelete);
        saveData();
        renderStudents();
        updateStudentCount();
        updateAttendanceSummary();
        updateMarksSummary();
        checkForStudents();
        closeModal();
    }
}

// Update student count
function updateStudentCount() {
    document.getElementById('total-students').textContent = students.length;
}

// Update attendance summary
function updateAttendanceSummary() {
    const presentCount = students.filter(student => student.attendance === 'present').length;
    document.getElementById('present-count').textContent = presentCount;
}

// Update marks summary
function updateMarksSummary() {
    if (students.length === 0) {
        document.getElementById('average-mark').textContent = '0';
        return;
    }
    
    let totalMarks = 0;
    let totalMarkEntries = 0;
    
    students.forEach(student => {
        if (student.marks && student.marks.length > 0) {
            student.marks.forEach(mark => {
                totalMarks += mark.value;
                totalMarkEntries++;
            });
        }
    });
    
    const averageMark = totalMarkEntries > 0 ? (totalMarks / totalMarkEntries).toFixed(1) : '0';
    document.getElementById('average-mark').textContent = averageMark;
}

// Check if there are any students
function checkForStudents() {
    if (students.length === 0) {
        noStudentsDiv.style.display = 'block';
        studentsTable.style.display = 'none';
    } else {
        noStudentsDiv.style.display = 'none';
        studentsTable.style.display = 'table';
    }
}

// Save data to localStorage
function saveData() {
    const classData = {
        className: document.getElementById('class-name').value,
        date: document.getElementById('date').value,
        students: students
    };
    
    localStorage.setItem('classPro', JSON.stringify(classData));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('classPro');
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        document.getElementById('class-name').value = parsedData.className || '';
        document.getElementById('date').value = parsedData.date || '';
        students = parsedData.students || [];
        
        // Convert old format to new format if needed
        students.forEach(student => {
            if (typeof student.marks === 'number') {
                student.marks = [{
                    title: 'Mark',
                    value: student.marks
                }];
            } else if (!Array.isArray(student.marks)) {
                student.marks = [];
            }
        });
        
        renderStudents();
    }
}