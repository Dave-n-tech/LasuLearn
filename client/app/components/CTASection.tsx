import Link from "next/link";

export default function CTASection() {

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning Experience?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of educators and students already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/register/student"} className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
