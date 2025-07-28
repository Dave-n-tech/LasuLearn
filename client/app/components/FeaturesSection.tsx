import {
  VideoIcon,
  ClockIcon,
  BarChart3Icon,
  CheckCircleIcon,
  MessageSquareIcon,
  CloudIcon,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: VideoIcon,
      title: "Asynchronous Video Lectures",
      description:
        "Access high-quality recorded lectures anytime, anywhere with intelligent playback tracking and progress monitoring.",
    },
    {
      icon: ClockIcon,
      title: "Smart Attendance Tracking",
      description:
        "Automatic attendance verification through video playback monitoring and engagement metrics.",
    },
    {
      icon: CheckCircleIcon,
      title: "Interactive In-Video Quizzes",
      description:
        "Embedded quizzes throughout lectures to ensure comprehension and maintain student engagement.",
    },
    {
      icon: BarChart3Icon,
      title: "Comprehensive Analytics",
      description:
        "Detailed insights into student progress, attendance patterns, and learning outcomes for educators.",
    },
    {
      icon: MessageSquareIcon,
      title: "Discussion Forums",
      description:
        "Collaborative learning spaces for students to discuss course content and share insights.",
    },
    {
      icon: CloudIcon,
      title: "Cloud-Based Delivery",
      description:
        "Secure, scalable cloud infrastructure ensuring reliable access to all learning materials.",
    },
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with educational best
            practices to create an engaging and effective learning environment.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
