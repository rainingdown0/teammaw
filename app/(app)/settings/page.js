import Link from "next/link";
import Button from "@/app/ui/button";

export default function Page() {
  return (
    <>
      <Link href={"/"}>
        <Button on text={"Log out"} />
      </Link>
    </>
  );
}
