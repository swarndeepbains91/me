# File Upload API - Public Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Free Tier)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Your app will be live at:** `https://your-app-name.up.railway.app`

---

### Option 2: Render (Free Tier)

1. **Go to:** https://render.com
2. **Connect your GitHub repository**
3. **Create new Web Service**
4. **Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

---

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Deploy:**
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Deploy file upload API"
   git push heroku main
   ```

---

### Option 4: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration

### Environment Variables (Optional)
- `PORT` - Server port (auto-detected by hosting platforms)
- `NODE_ENV` - Set to `production` for production deployment

### File Storage
- Files stored in `/uploads` directory on the server
- **Note:** Some free hosting services have ephemeral file systems
- For persistent storage, consider using cloud storage (AWS S3, Google Cloud, etc.)

---

## 🌐 Access Your Deployed API

Once deployed, your API will be available at:

```
https://your-domain.com/              # Portfolio homepage
https://your-domain.com/upload.html   # File upload page
https://your-domain.com/api/upload    # Upload endpoint
https://your-domain.com/api/files     # Files list endpoint
```

---

## 🧪 Testing

1. **Local testing:**
   ```bash
   npm start
   # Visit: http://localhost:3000/upload.html
   ```

2. **Production testing:**
   - Visit your deployed URL + `/upload.html`
   - Try uploading a small test file
   - Verify file appears in the files list

---

## 📁 File Limits

- **Size:** 10MB per file
- **Types:** JPEG, PNG, PDF, DOC, TXT, ZIP
- **Simultaneous uploads:** 5 files max

---

## 🔒 Security Notes

- CORS enabled for all origins (suitable for public portfolio)
- File type validation implemented
- File size limits enforced
- No authentication required (adjust for production needs)

---

## 💡 Next Steps

1. **Deploy using one of the options above**
2. **Update your domain/DNS if needed**
3. **Test file upload functionality**
4. **Share your public portfolio URL!**

Your file upload API is ready for public deployment! 🎉