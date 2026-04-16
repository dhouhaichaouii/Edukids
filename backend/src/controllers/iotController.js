const Student = require('../models/Student')

async function resolveStudentByCode(req, res) {
  try {
    const { studentCode } = req.body

    if (!studentCode || !String(studentCode).trim()) {
      return res.status(400).json({
        success: false,
        message: 'studentCode est requis',
      })
    }

    const cleanCode = String(studentCode).trim().toUpperCase()

    const student = await Student.findOne({ studentCode: cleanCode }).lean()

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève introuvable',
      })
    }

    return res.json({
      success: true,
      data: {
        studentId: student._id.toString(),
        classIds: student.classIds || [],
        studentCode: student.studentCode,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = {
  resolveStudentByCode,
}