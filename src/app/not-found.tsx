import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="grid min-h-dvh place-items-center py-32">
      <Container className="text-center">
        <p className="font-display text-[clamp(7rem,30vw,18rem)] font-extrabold leading-none text-outline">404</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase sm:text-6xl">Off route</h1>
        <p className="mt-4 text-mist">That page does not exist. Let&rsquo;s get you back on track.</p>
        <div className="mt-8 flex justify-center"><Button href="/">Back home</Button></div>
      </Container>
    </section>
  );
}
