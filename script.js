const API_URL = 'http://localhost:5000/api/students';

let allStudents = [];

// Fetch and display students
async function getStudents() {
  try {
    const res = await fetch(API_URL);
    allStudents = await res.json();
    renderStudents(allStudents);
    updateStats(allStudents);
  } catch (err) {
    console.error('Error fetching students:', err);
  }
}

// Render students to HTML table
function renderStudents(students) {
  const studentList = document.getElementById('student-list');
  studentList.innerHTML = '';

  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td>${student.gender}</td>
      <td><button class="btn-delete" onclick="deleteStudent('${student._id}')">Delete</button></td>
    `;
    studentList.appendChild(tr);
  });
}

// Update stats count
function updateStats(students) {
  document.getElementById('total-students').innerText = students.length;
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  
  document.getElementById('male-students').innerText = maleCount;
  document.getElementById('female-students').innerText = femaleCount;
}

// Add new student
document.getElementById('student-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    course: document.getElementById('course').value,
    gender: document.getElementById('gender').value,
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    document.getElementById('student-form').reset();
    getStudents(); // Refresh list
  } catch (err) {
    console.error('Error adding student:', err);
  }
});

// Delete student
async function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      getStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  }
}

// Search filter
function filterStudents() {
  const query = document.getElementById('search').value.toLowerCase();
  const filtered = allStudents.filter(student =>
    student.name.toLowerCase().includes(query)
  );
  renderStudents(filtered);
}

// Initial load
getStudents();