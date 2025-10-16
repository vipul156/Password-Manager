"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useForm } from "react-hook-form";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import "react-toastify/dist/ReactToastify.css";

// ⚡ Lazy-load heavy icons
const FaCopy = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaCopy)
);
const FaTrashAlt = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaTrashAlt)
);
const FaEdit = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaEdit)
);

export default function Passwords() {
  // --- States ---
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [passwords, setPasswords] = useState([]);

  // --- React Hook Form setup ---
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // --- Load passwords from localStorage ---
  useEffect(() => {
    // Avoid blocking render — defer localStorage read
    requestIdleCallback(() => {
      try {
        const saved = localStorage.getItem("passwords");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setPasswords(parsed);
        }
      } catch (err) {
        console.error("Error loading passwords:", err);
      }
    });
  }, []);

  // --- Save passwords ---
  const saveToLocalStorage = useCallback((dataList) => {
    try {
      localStorage.setItem("passwords", JSON.stringify(dataList));
    } catch {
      console.warn("Failed to save to localStorage");
    }
  }, []);

  // --- Form Submit ---
  const onSubmit = (data) => {
    let updated;
    if (editIndex !== null) {
      updated = [...passwords];
      updated[editIndex] = data;
      setEditIndex(null);
      toast.success("Password updated successfully ✏️", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      updated = [...passwords, data];
      toast.success("Password saved successfully 🔐", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
    }
    setPasswords(updated);
    saveToLocalStorage(updated);
    reset();
  };

  // --- Helpers ---
  const handleHide = () => setShow((prev) => !prev);

  const copyText = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard 📋", {
      position: "top-right",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });
  }, []);

  const editPass = (index) => {
    const item = passwords[index];
    setValue("url", item.url);
    setValue("username", item.username);
    setValue("password", item.password);
    setEditIndex(index);
    toast.info("Editing password ✏️", {
      position: "top-right",
      autoClose: 1200,
      theme: "colored",
      transition: Bounce,
    });
  };

  const deletePass = (index) => {
    if (!window.confirm("Are you sure you want to delete this password?"))
      return;
    const updated = passwords.filter((_, i) => i !== index);
    setPasswords(updated);
    saveToLocalStorage(updated);
    toast.error("Password deleted 🗑️", {
      position: "top-right",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });
  };

  // --- Render ---
  return (
    <main className="min-h-[90vh] p-4 sm:p-8 bg-white flex flex-col items-center pb-20">
      <ToastContainer />

      {/* Header - LCP optimized: visible immediately */}
      <header className="text-center mb-6">
        <h1 className="text-[32px] sm:text-[40px] font-semibold leading-tight">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">Op/&gt;</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Your Own Password Manager
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-xl"
      >
        <input
          placeholder="Enter Website URL"
          {...register("url", { required: "Website URL is required" })}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />
        {errors.url && (
          <span className="text-red-500 text-sm">{errors.url.message}</span>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <input
              placeholder="Enter Username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="w-full sm:w-1/2 relative">
            <input
              placeholder="Enter Password"
              type={show ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            <span
              className="absolute right-[8px] top-[6px] cursor-pointer"
              onClick={handleHide}
            >
              {show ? <PiEyeLight size={22} /> : <PiEyeSlash size={22} />}
            </span>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition text-sm sm:text-base"
        >
          {editIndex !== null ? "Update Password" : "Add Password"}
        </button>
      </form>

      {/* Password List (Lazy-loaded) */}
      <Suspense
        fallback={
          <p className="mt-6 text-gray-400">Loading saved passwords...</p>
        }
      >
        {passwords.length > 0 && (
          <section className="w-full max-w-5xl mt-10">
            <h2 className="text-center text-lg sm:text-xl font-semibold mb-4">
              Saved Passwords
            </h2>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Website</th>
                    <th className="py-3 px-4 text-left">Username</th>
                    <th className="py-3 px-4 text-left">Password</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passwords.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 border-t border-gray-200"
                    >
                      <td className="py-3 px-4">
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate max-w-[200px]">
                            {item.url}
                          </span>
                          <FaCopy
                            size={18}
                            className="cursor-pointer text-gray-500 hover:text-green-600 transition"
                            onClick={() => copyText(item.url)}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-between items-center gap-2">
                          <span>{item.username}</span>
                          <FaCopy
                            size={18}
                            className="cursor-pointer text-gray-500 hover:text-green-600 transition"
                            onClick={() => copyText(item.username)}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-between items-center gap-2">
                          <span>{item.password}</span>
                          <FaCopy
                            size={18}
                            className="cursor-pointer text-gray-500 hover:text-green-600 transition"
                            onClick={() => copyText(item.password)}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition"
                          onClick={() => editPass(index)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => deletePass(index)}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4">
              {passwords.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200"
                >
                  <div className="mb-2">
                    <strong>Website:</strong>{" "}
                    <span className="break-all">{item.url}</span>
                    <FaCopy
                      size={18}
                      className="inline ml-2 cursor-pointer text-gray-500 hover:text-green-600 transition"
                      onClick={() => copyText(item.url)}
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Username:</strong> {item.username}
                    <FaCopy
                      size={18}
                      className="inline ml-2 cursor-pointer text-gray-500 hover:text-green-600 transition"
                      onClick={() => copyText(item.username)}
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Password:</strong> {item.password}
                    <FaCopy
                      size={18}
                      className="inline ml-2 cursor-pointer text-gray-500 hover:text-green-600 transition"
                      onClick={() => copyText(item.password)}
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => editPass(index)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => deletePass(index)}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Suspense>
    </main>
  );
}
