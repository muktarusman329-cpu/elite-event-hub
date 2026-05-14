function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_0.7fr]">
        <div className="space-y-6">
          <div className="glass-surface rounded-[2rem] border border-white/10 p-10 shadow-glass">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Contact us</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Let's bring the event to life.</h1>
            <p className="mt-4 text-slate-300 leading-7">
              Whether you need a custom quote, venue consultation, or admin support, our team is ready to help.
            </p>
            <div className="mt-8 space-y-4 text-slate-300">
              <p><strong>Phone:</strong> +1 555 123 9876</p>
              <p><strong>Email:</strong> hello@eliteeventhub.com</p>
              <p><strong>Location:</strong> 42 Prestige Avenue, City Center</p>
            </div>
          </div>
          <iframe
            title="Google Maps"
            className="h-96 w-full rounded-[2rem] border border-white/10 shadow-glass"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434507861!2d144.953735315316!3d-37.81627974202166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f2c02ab7%3A0x141b76a72dcaf55!2sFederation%20Square!5e0!3m2!1sen!2sus!4v1694527263771!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          />
        </div>
        <div className="glass-surface rounded-[2rem] border border-white/10 p-10 shadow-glass">
          <h2 className="text-3xl font-semibold text-white">Send a message</h2>
          <form className="mt-8 space-y-5">
            <label className="block text-sm text-slate-300">
              Name
              <input className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none" placeholder="Your name" />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none" placeholder="you@example.com" />
            </label>
            <label className="block text-sm text-slate-300">
              Message
              <textarea rows="5" className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none" placeholder="Tell us about your event."></textarea>
            </label>
            <button className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Submit inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
