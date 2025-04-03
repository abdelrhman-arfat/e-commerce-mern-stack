"use client";
import { useGetAllUserQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import Swal from "sweetalert2";
import Image from "next/image";
import React, { useState } from "react";
import useUserSelector from "@/app/hooks/AppSelector";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import Loader from "../../lodingAndErrors/Loader";
import Error from "../../lodingAndErrors/Error";
import Link from "next/link";
import Refresh from "../../btns/Refresh";

const UserTable = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useGetAllUserQuery({ page });

  const me = useUserSelector();
  if (me.user?.role === "USER") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have permission to view this page.
          </p>

          <div className="mt-4">
            <Link href="/">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }
  return (
    <>
      <div>
        <Refresh refetch={refetch} />
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
              {Array.isArray(data?.results) &&
                data?.results?.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b text-sm transition duration-200 hover:bg-gray-50"
                  >
                    <td className="p-3   flex items-center">
                      {user.profilePicture === null ||
                      user.profilePicture === "" ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-six text-white border border-gray-300">
                          {(user.fullname && user?.fullname[0]) ||
                            (user.username && user?.username[0])}
                        </div>
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
                        <div className="flex h-full items-center">
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
                                      res.data.message ||
                                        "Failed to delete user."
                                    );
                                    return;
                                  }
                                  toast.success(
                                    res.data.message ||
                                      "user deleted successfully"
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
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Change Role?",
                                text: `Are you sure you want to make this user an ${
                                  user.role === "USER" ? "ADMIN" : "USER"
                                }`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, change it!",
                              });

                              if (result.isConfirmed) {
                                toast
                                  .promise(
                                    app.patch(
                                      `/admin/change-user-role?user_id=${
                                        user._id
                                      }&role=${
                                        user.role === "USER" ? "ADMIN" : "USER"
                                      }`
                                    ),
                                    {
                                      loading: "Changing role...",
                                      success: "User role updated to Admin!",
                                      error: "Failed to change role.",
                                    }
                                  )
                                  .then(() => refetch()); // تحديث البيانات بعد تغيير الدور
                              }
                            }}
                            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition duration-200 shadow-md"
                          >
                            Role
                          </button>
                        </div>
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
