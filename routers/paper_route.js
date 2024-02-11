const express = require("express");
const PaperModel = require("../models/qpaper");
const isUserAdmin = require("../middleware");
const { validateToken } = require("../jwt");

const paperRouter = express.Router();

paperRouter.post("/api/addQPaper", validateToken, isUserAdmin, async (req, res) => {
    try {
        const { university, department, subject, year, sem, paperLink } = req.body;
        const parsedYear = parseInt(year), parsedSem = parseInt(sem);
        if (isNaN(parsedYear) || isNaN(parsedSem)) {
            return res.status(400).json({
                status: 'failed',
                message: "Year and Sem Fields should be integer",
            });
        }
        const newPaper = await PaperModel.create({
            university: university.trim(),
            department: department.trim(),
            subject: subject.trim(),
            year: parsedYear,
            sem: parsedSem,
            paperLink: paperLink.trim(),
        });
        return res.status(201).json({
            "status": "success",
            "data": newPaper,
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }

});

paperRouter.get("/api/getQPaper", validateToken, async (req, res) => {
    try {
        const { university, department, subject, year, sem } = req.query;
        const conditions = {};

        if (university) conditions.university = new RegExp(university.toLowerCase().trim(), 'i');
        if (department) conditions.department = new RegExp(department.toLowerCase().trim(), 'i');
        if (subject) conditions.subject = new RegExp(subject.toLowerCase().trim(), 'i');
        if (year) conditions.year = parseInt(year);
        if (sem) conditions.sem = parseInt(sem);
        const qpapers = await PaperModel.find(conditions);
        res.status(200).json({
            "status": "success",
            "message": "Papers Fetched Successfully",
            "data": qpapers
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

paperRouter.get("/api/getFields", validateToken, async (req, res) => {
    try {
        const univeristies = await PaperModel.distinct("university");
        const departments = await PaperModel.distinct("department");
        const subjects = await PaperModel.distinct("subject");
        const year = await PaperModel.distinct("year");
        const sem = await PaperModel.distinct("sem");
        return res.json({
            status: "success",
            message: "Data Fetched",
            data: {
                university: univeristies,
                department: departments,
                subject: subjects,
                year: year.map(String),
                sem: sem.map(String)
            }
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});


paperRouter.delete("/api/addQPaper/:id", validateToken, isUserAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const paper = await PaperModel.findByIdAndDelete(id);
        return res.status(201).json({
            "status": "success",
            "message": "Question Paper Deleted Successfully",
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

paperRouter.patch("/api/addQPaper/:id", validateToken, isUserAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { university, department, subject, year, sem, paperLink } = req.body;
        const parsedYear = parseInt(year), parsedSem = parseInt(sem);
        if (isNaN(parsedYear) || isNaN(parsedSem)) {
            return res.status(400).json({
                status: 'failed',
                message: "Year and Sem Fields should be integer",
            });
        }
        const newPaper = await PaperModel.findByIdAndUpdate(id, {
            university: university.trim(),
            department: department.trim(),
            subject: subject.trim(),
            year: parsedYear,
            sem: parsedSem,
            paperLink: paperLink.trim(),
        });
        return res.status(201).json({
            "status": "success",
            "data": newPaper,
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message,
        });
    }
});

module.exports = paperRouter;