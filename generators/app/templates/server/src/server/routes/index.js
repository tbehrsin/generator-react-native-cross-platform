
import express from 'express';
import mongoose from 'mongoose';
export const router = express.Router();

router.get('/', (req, res) => res.render('home', { layout: 'site', lightContent: true }));
