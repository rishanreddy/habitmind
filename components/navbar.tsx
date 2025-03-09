"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
// @ts-ignore
import { scroller } from "react-scroll";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="navbar bg-base-300 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#howitworks">How it Works</Link>
            </li>
            <li>
              <Link href="/#features">Features</Link>
            </li>
            <li>
              <Link href="/sign-up" className="btn btn-primary w-full">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
        {/* Fix: Use consistent className */}
        <Link href="/" className="btn btn-ghost text-xl">
          <Image
            src="/icon.svg"
            width={100}
            height={40} /* Adjust height to match actual visual height */
            alt="HabitMind Logo"
          />
          HabitMind.ai
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>

          {pathname === "/" ? (
            <>
              <li>
                <button
                  type="button" /* Add button type for accessibility */
                  onClick={() =>
                    scroller.scrollTo("howitworks", {
                      smooth: true,
                    })
                  }
                >
                  How it Works
                </button>
              </li>

              <li>
                <button
                  type="button" /* Add button type for accessibility */
                  onClick={() =>
                    scroller.scrollTo("features", {
                      smooth: true,
                    })
                  }
                >
                  Features
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/#howitworks">How it Works</Link>
              </li>

              <li>
                <Link href="/#features">Features</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end flex gap-3">
        <Link href="/dashboard" className="btn btn-accent">
          Dashboard <ArrowRight />
        </Link>

        {session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={
                    session.user.image ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAMFBMVEXk5ueutLfo6uu7wMOrsbTd4OGnrrHLz9HY29zh4+TGyszT1tizubzCx8m3vb/Q09VRU5zBAAAD2klEQVR4nO2c2ZKsIAxAJSyCLP7/317U3qYXGwgG+xan5mEeT0UCAUIPQ6fT6XQ6nU6n0+l0Op3fBmAYzPq3/HdGope2o+cLfhqtHM4nCqC9Y0zcYM55eaqIwiAnpgR7QigxytN4gvTsRfEiyqZzeIL56HjxPIOm3nNcPZ1u7Qn+i+NK43CakCLJBDcNJaVLkoyawTQLp0lT3DRbTfIyXXLRlE0kjcuxjGOzRTCBJ47Jm2aDTIdR5UlGzZlcUuc6Rhz1fJQ4UT4Fk3howlggyZiiXSuhSJIxTiqZtHq/YyYMpsybKu8IwmAWjspVU9NploaSNM1l9oT+oEk1Z5bnzgJV/pROQxtU+SNRlo6mgkNk+ArN+gMeJUlVGXGcpSeRLF54LpY06YO0ZI7EsqT+/RNMCsmiKv0RRWJpcRPRr1hSrOTdsiI/keNoS0ZiiZ3VA4mlCShJqg0astqYSCSxlZulqS8tytJR7XVxOwqiTSSg0sdT7SFnRDCJhuWA20QKuuOs8mMDwsN1TJZT3qeU5g/RBnIDbOl5FuHBYNRMvYB8DiXt8X9ZmhMm+EZJmgvKU/WVzFvIVZL0hmIF8r+5a9Bokn1ASHwldWXK0qQflBtZ5+tibNUSkaGpWrbBJH/0Rp97Iy2FBCMrKj9o6u9rpQjNe90AdtvclkA2y5tHQPPPFZJQvnmX2wXQ4W08hWC8+ce+s3SyhqWB9U8UGT9J8+UNAKNHzpRa222VioqjbNfbtgcASGvnedYSTtUS/Ag80drnmUVJ63mctkbwtRV8ttqcxDUOR6PnaRmQ25C8Zfc6OBULPn5+07DJPsZJz547ocTOtB5tXfCjbSVqtzb6vXXnvv4wxmdD2ygKg5y9eG2j/6KqwqjJJicAGz9z2U7X8ZHCc32MgDplFfzo840YRl8WxUdNwecjRyhIjovj1ZOF42p3GRA9WS+i9ogBuvPwpNCT199mwFjXcdFkvm44Y5lb23HzrNlbdEAgr57VwglF/dSpmqLOtgi+PjNCeta4PY1f+2BEwEdzqjdHftREH2yi2laJNLPfnZRqMkyqE0kuFEcT16Wchyi9NgeCxHnULJPE3IKXaBbds2S9fauiWXKCeOyK8478qxbIuyapQ24GIbtxCsld0o8sg/bI2l5S5/cV4XJGJu49BwKVsRdqkjobGXN7wd13NZKDiX10giFjBSIshV5JbTjCvTJCkrpONsydlUTLhrkTEYmfvG0o0y5X0b39WJLedcLUVpKFlMqIat/4kaSniAbXjl7BMqUwSv49kqNI6hyWvDHBJsTy5WqWnBTJTqfzP/EPdj8xiRLXnHUAAAAASUVORK5CYII="
                  }
                  width={48}
                  height={48}
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 z-50"
            >
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }}
                  className="text-error"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/sign-up" className="btn btn-primary">
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
