# Faculty E-Content Website

A modern, responsive faculty website for sharing educational content including videos, study materials, and managing student interactions.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and set your values
   ```

3. **Start the backend server**:
   ```bash
   cd server
   npm start
   ```

4. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Admin Access

- **Email**: `admin@university.edu`
- **Password**: `admin123`

## 📦 Deployment to Vercel

For detailed deployment instructions, see [implementation_plan.md](C:\Users\Jeeva\.gemini\antigravity\brain\f55859bc-56b0-4add-a879-61b61f701d59\implementation_plan.md)

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see deployment guide)
   - Click Deploy

3. **Set environment variables in Vercel**:
   - `JWT_SECRET`: Your secure random string
   - `FRONTEND_URL`: Your Vercel app URL

## 📁 Project Structure

```
faculty-website/
├── api/                    # Serverless API for Vercel
│   ├── index.js           # API entry point
│   └── package.json       # API dependencies
├── server/                # Local backend server
│   ├── server.js          # Express server
│   ├── data.json          # Local data storage
│   └── uploads/           # File uploads
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   └── App.jsx           # Main app component
├── public/               # Static assets
├── vercel.json           # Vercel configuration
└── .env.example          # Environment template
```

## ✨ Features

- 📹 **Video Library**: YouTube video integration with views tracking
- 📚 **Study Materials**: Upload and download course materials
- 💬 **Contact Form**: Student inquiries and messaging
- 🔐 **Admin Dashboard**: Full CRUD operations for content management
- 🎨 **Responsive Design**: Mobile-friendly UI
- 🔍 **Search Functionality**: Find content easily
- 📊 **Analytics**: View statistics on content engagement

## 🛠️ Technologies

### Frontend
- React 19
- React Router DOM
- Vite
- CSS3

### Backend
- Express.js
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

### Deployment
- Vercel (hosting)
- Serverless Functions

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start server
- `npm run dev` - Start with hot reload

## ⚠️ Important Notes

### Data Persistence
The current setup uses file-based storage which is **not suitable for production on Vercel**. For production deployment:

1. Integrate a database:
   - MongoDB Atlas
   - Supabase (PostgreSQL)
   - PlanetScale (MySQL)
   - Neon (PostgreSQL)

2. Use cloud storage for file uploads:
   - Cloudinary
   - AWS S3
   - Vercel Blob

### Security
- Change default admin credentials immediately
- Use a strong `JWT_SECRET` in production
- Keep `.env` file secure and never commit it

## 📝 License

This project is for educational purposes.

## 👤 Author

**Madhankumar C**
- Email: madhankumar@university.edu
- Phone: +91 7904863245

## 🤝 Contributing

This is a personal faculty website. For issues or suggestions, please contact the administrator.

## 📞 Support

For technical support or questions, please use the contact form on the website or email the administrator directly.
