import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
    }
};

// Project Schema
export const projectSchema = z.object({
    title: z.string().min(3).max(100),
    slug: z.string().optional(),
    description: z.string().min(10),
    content: z.string().optional(),
    thumbnail: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    demoUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional(),
    order: z.number().optional()
});

// Blog Schema
export const blogSchema = z.object({
    title: z.string().min(5).max(150),
    excerpt: z.string().min(10).max(300),
    content: z.string().min(20),
    thumbnail: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional()
});

// Testimonial Schema
export const testimonialSchema = z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    company: z.string().optional(),
    content: z.string().min(10).max(500),
    avatar: z.string().url().optional(),
    rating: z.number().min(1).max(5).optional(),
    featured: z.boolean().optional()
});

// Contact Schema
export const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10).max(1000)
});
