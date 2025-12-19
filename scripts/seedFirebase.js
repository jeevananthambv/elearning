// Firebase Seed Script - Run this once to populate Firestore with initial data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCnP1X_R_Kstcvh4BT55ikpu5wFH1ziSEk",
    authDomain: "econtent-7d7d5.firebaseapp.com",
    projectId: "econtent-7d7d5",
    storageBucket: "econtent-7d7d5.firebasestorage.app",
    messagingSenderId: "789474158958",
    appId: "1:789474158958:web:c10ef3c266555db584f97f",
    measurementId: "G-TPVV2749S0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    // 1. Create Admin User in Firebase Auth
    console.log('👤 Creating admin user...');
    try {
        await createUserWithEmailAndPassword(auth, 'admin@university.edu', 'admin123');
        console.log('✅ Admin user created: admin@university.edu / admin123');
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️  Admin user already exists');
        } else {
            console.error('❌ Error creating admin:', error.message);
        }
    }

    // 2. Seed Videos
    console.log('\n📹 Seeding videos...');
    const videos = [
        { title: 'Introduction to Data Structures', subject: 'Data Structures', description: 'Learn the fundamentals of data structures including arrays, linked lists, and their applications.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop', duration: '45:30', youtubeId: 'dQw4w9WgXcQ', views: 0 },
        { title: 'Object Oriented Programming Basics', subject: 'Programming', description: 'Understanding OOP concepts like classes, objects, inheritance, and polymorphism.', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop', duration: '38:15', youtubeId: 'dQw4w9WgXcQ', views: 0 },
        { title: 'Database Management Systems', subject: 'DBMS', description: 'Comprehensive overview of database concepts, SQL, and normalization techniques.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop', duration: '52:00', youtubeId: 'dQw4w9WgXcQ', views: 0 },
        { title: 'Algorithm Analysis', subject: 'Algorithms', description: 'Learn how to analyze algorithm complexity and optimize your code for better performance.', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop', duration: '41:20', youtubeId: 'dQw4w9WgXcQ', views: 0 },
        { title: 'Operating Systems Concepts', subject: 'Operating Systems', description: 'Understanding process management, memory management, and file systems.', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop', duration: '55:45', youtubeId: 'dQw4w9WgXcQ', views: 0 },
        { title: 'Computer Networks Fundamentals', subject: 'Networking', description: 'Learn about OSI model, TCP/IP, routing, and network security basics.', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', duration: '48:30', youtubeId: 'dQw4w9WgXcQ', views: 0 }
    ];

    for (const video of videos) {
        await addDoc(collection(db, 'videos'), {
            ...video,
            createdAt: new Date().toISOString()
        });
    }
    console.log(`✅ Added ${videos.length} videos`);

    // 3. Seed Profile
    console.log('\n👨‍🏫 Seeding profile...');
    await setDoc(doc(db, 'settings', 'profile'), {
        name: 'Madhankumar C',
        title: 'Assistant Professor',
        department: 'Computer Science & Engineering',
        email: 'madhankumar@university.edu',
        phone: '+91 7904863245',
        location: 'Room 304, CS Block',
        about: 'I am a passionate educator with over 10 years of experience in teaching Computer Science.',
        experience: '10+ Years',
        education: 'Ph.D. in Computer Science',
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop'
    });
    console.log('✅ Profile created');

    // 4. Seed Site Content
    console.log('\n🎨 Seeding site content...');
    await setDoc(doc(db, 'settings', 'siteContent'), {
        branding: {
            title: 'E-Content',
            subtitle: 'Faculty Portal'
        },
        hero: {
            title: 'Welcome to E-Content Portal',
            description: 'Access quality educational resources, video lectures, and study materials.',
            ctaPrimary: 'Explore Videos',
            ctaSecondary: 'Browse Materials'
        }
    });
    console.log('✅ Site content created');

    console.log('\n🎉 Database seeding complete!');
    console.log('\n📋 Summary:');
    console.log('   - Admin: admin@university.edu / admin123');
    console.log('   - Videos: 6');
    console.log('   - Profile: Created');
    console.log('   - Site Content: Created');

    process.exit(0);
}

seedDatabase().catch(console.error);
