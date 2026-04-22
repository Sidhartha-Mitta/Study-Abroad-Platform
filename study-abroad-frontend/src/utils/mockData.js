export const mockUniversities = [
  { id: '1', name: 'Northstar University', country: 'USA', city: 'Boston', ranking: 18, programCount: 42, website: 'https://example.edu' },
  { id: '2', name: 'Kingston Global College', country: 'UK', city: 'London', ranking: 26, programCount: 36 },
  { id: '3', name: 'Maple Institute of Technology', country: 'Canada', city: 'Toronto', ranking: 41, programCount: 30 },
  { id: '4', name: 'Southern Cross University', country: 'Australia', city: 'Melbourne', ranking: 58, programCount: 28 },
  { id: '5', name: 'Rhine School of Applied Sciences', country: 'Germany', city: 'Berlin', ranking: 74, programCount: 24 },
  { id: '6', name: 'Canal Academy Amsterdam', country: 'Netherlands', city: 'Amsterdam', ranking: 88, programCount: 22 },
]

export const mockPrograms = [
  { id: 'p1', name: 'MSc Data Science', universityId: '1', universityName: 'Northstar University', country: 'USA', field: 'Data Science', degree: 'Masters', tuition: 42000, duration: 24, ieltsMin: 7, intakes: ['September', 'January'] },
  { id: 'p2', name: 'Bachelors in Global Business', universityId: '2', universityName: 'Kingston Global College', country: 'UK', field: 'Business', degree: 'Bachelors', tuition: 31000, duration: 36, ieltsMin: 6.5, intakes: ['September'] },
  { id: 'p3', name: 'MEng Sustainable Systems', universityId: '3', universityName: 'Maple Institute of Technology', country: 'Canada', field: 'Engineering', degree: 'Masters', tuition: 28000, duration: 24, ieltsMin: 6.5, intakes: ['January', 'September'] },
  { id: 'p4', name: 'Diploma in UX Design', universityId: '4', universityName: 'Southern Cross University', country: 'Australia', field: 'Design', degree: 'Diploma', tuition: 19000, duration: 12, ieltsMin: 6, intakes: ['March', 'October'] },
]

export const mockRecommendations = mockPrograms.slice(0, 3).map((program, i) => ({ program, university: mockUniversities.find((u) => u.id === program.universityId), score: 8 - i }))
