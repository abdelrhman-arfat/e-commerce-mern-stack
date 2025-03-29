"use client";
import { useGetAllUserQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import Swal from "sweetalert2";
import Image from "next/image";
import React, { useState } from "react";
import useUserSelector from "@/app/hooks/AppSelector";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";

const UserTable = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useGetAllUserQuery({ page });

  const me = useUserSelector();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: in get data</p>;
  }

  return (
    <>
      <div>
        <div className="flex p-4 justify-between items-center ">
          <button
            disabled={page === 1}
            className={`px-4 py-2 bg-blue-600 text-white text-[12px] sm:text-sm md:text-[16px] rounded-md hover:bg-blue-500 
    ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          >
            Prev
          </button>

          <button
            disabled={page === data?.totalPages}
            className={`px-4 py-2 bg-blue-600 text-white text-[12px] sm:text-sm md:text-[16px] rounded-md hover:bg-blue-500 
    ${page === data?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() =>
              setPage((prevPage) =>
                prevPage === data?.totalPages ? prevPage : prevPage + 1
              )
            }
          >
            Next
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto rounded-lg  shadow-lg border border-gray-300">
          <table className="w-full border-collapse   bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3  text-left text-sm font-semibold">Image</th>
                <th className="py-3 px-1  text-left text-sm font-semibold hidden sm:table-cell">
                  Name
                </th>
                <th className="py-3 px-1  text-left text-sm font-semibold">
                  Email
                </th>
                <th className="py-3 px-1  text-left text-sm font-semibold">
                  role
                </th>
                <th className="py-3 px-1  text-left text-sm font-semibold hidden sm:table-cell">
                  Verified
                </th>
                <th className="py-3 px-1  text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.results?.map((user, i) => (
                <tr
                  key={i}
                  className="border-b text-sm transition duration-200 hover:bg-gray-50"
                >
                  <td className="p-3   flex items-center">
                    {user.profilePicture === null ||
                    user.profilePicture === "" ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-400 border border-gray-300"></div>
                    ) : (
                      <Image
                        src={user?.profilePicture as string}
                        alt="User"
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-300"
                        priority
                      />
                    )}
                  </td>
                  <td className="py-3 px-1 hidden items-center sm:table-cell">
                    {user.fullname}
                  </td>
                  <td className="py-3 px-1">{user.email}</td>
                  <td className="py-3 px-1">{user.role}</td>
                  <td
                    style={{
                      color: user.isVerified ? "green" : "red",
                    }}
                    className="py-3 px-1 font-semibold  text-[12px] hidden sm:table-cell"
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-1">
                    {me?.user?._id === user._id ? (
                      <div>Your account</div>
                    ) : (
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              const res = await app.delete(
                                `/admin/delete-user/${user._id}`
                              );
                              if (res.status !== 200) {
                                toast.error(
                                  res.data.message || "Failed to delete user."
                                );
                                return;
                              }
                              toast.success(
                                res.data.message || "user deleted successfully"
                              );
                              refetch();
                              return;
                            }
                          });
                        }}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition duration-200 shadow-md"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTable;
