/**
 * Yaalu Rider App - Tailwind/TWRNC Setup
 * Import `tw` from this file in all screens instead of directly from 'twrnc'
 * This ensures custom brand colors are applied across the whole app.
 */
import { create } from 'twrnc';

const tw = create(require('../tailwind.config.js'));

export default tw;
