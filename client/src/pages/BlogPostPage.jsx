import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Tag
} from "lucide-react";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Mock blog post data - in a real app, this would come from an API
  const mockPost = {
    id: parseInt(id),
    title: "10 Essential JavaScript Concepts Every Developer Should Master",
    content: `
      <p>JavaScript is the backbone of modern web development, powering everything from simple websites to complex web applications. Whether you're just starting your journey or looking to solidify your understanding, mastering these fundamental concepts will make you a more effective developer.</p>
      
      <h2>1. Variables and Scope</h2>
      <p>Understanding how variables work in JavaScript is crucial. The difference between <code>var</code>, <code>let</code>, and <code>const</code> goes beyond just syntax - it affects how your code behaves.</p>
      
      <pre><code>// Function scope with var
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside the block
}

// Block scope with let and const
function example2() {
  if (true) {
    let y = 1;
    const z = 2;
  }
  console.log(y); // ReferenceError: y is not defined
}</code></pre>

      <h2>2. Closures</h2>
      <p>Closures are one of JavaScript's most powerful features. They allow functions to access variables from their outer scope even after the outer function has returned.</p>
      
      <pre><code>function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2</code></pre>

      <h2>3. Promises and Async/Await</h2>
      <p>Modern JavaScript heavily relies on asynchronous programming. Understanding Promises and async/await is essential for handling API calls, file operations, and other asynchronous tasks.</p>
      
      <pre><code>// Promise-based approach
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/await approach
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}</code></pre>

      <h2>4. Array Methods</h2>
      <p>JavaScript's array methods like <code>map</code>, <code>filter</code>, <code>reduce</code>, and <code>forEach</code> are incredibly powerful for data manipulation.</p>
      
      <pre><code>const numbers = [1, 2, 3, 4, 5];

// Transform data with map
const doubled = numbers.map(n => n * 2);

// Filter data
const evens = numbers.filter(n => n % 2 === 0);

// Reduce to a single value
const sum = numbers.reduce((acc, n) => acc + n, 0);</code></pre>

      <h2>5. Object-Oriented Programming</h2>
      <p>Understanding classes, inheritance, and prototypes helps you write more organized and reusable code.</p>
      
      <pre><code>class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks\`);
  }
}

const dog = new Dog("Rex");
dog.speak(); // "Rex barks"</code></pre>

      <p>These concepts form the foundation of JavaScript development. Take time to practice each one, and you'll find yourself writing more confident and effective code. Remember, the key to mastering JavaScript is consistent practice and building real projects.</p>
    `,
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      role: "Senior JavaScript Developer",
      bio: "Sarah has been developing with JavaScript for over 8 years and loves sharing her knowledge with the community."
    },
    category: "JavaScript",
    tags: ["JavaScript", "Web Development", "Programming", "Tutorial"],
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=600&fit=crop",
    likes: 234,
    comments: 45
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-1 ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes + (liked ? 1 : 0)}</span>
                </button>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-600">{post.author.role}</p>
              </div>
            </div>
          </div>

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-100 rounded-lg">
              <div className="flex items-start">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full mr-4 flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    About {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{post.author.role}</p>
                  <p className="text-gray-700">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#variables" className="block text-sm text-gray-600 hover:text-blue-600">
                    1. Variables and Scope
                  </a>
                  <a href="#closures" className="block text-sm text-gray-600 hover:text-blue-600">
                    2. Closures
                  </a>
                  <a href="#promises" className="block text-sm text-gray-600 hover:text-blue-600">
                    3. Promises and Async/Await
                  </a>
                  <a href="#arrays" className="block text-sm text-gray-600 hover:text-blue-600">
                    4. Array Methods
                  </a>
                  <a href="#oop" className="block text-sm text-gray-600 hover:text-blue-600">
                    5. Object-Oriented Programming
                  </a>
                </nav>
              </div>

              {/* Related Articles */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <Link to="/blog/2" className="block group">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                      The Future of React: What's Coming in 2024
                    </h4>
                    <p className="text-xs text-gray-500">6 min read</p>
                  </Link>
                  <Link to="/blog/3" className="block group">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                      Building Scalable APIs with Node.js
                    </h4>
                    <p className="text-xs text-gray-500">12 min read</p>
                  </Link>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest articles delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;