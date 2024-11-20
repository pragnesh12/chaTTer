import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_IMAGE_URL } from "../../config/AppConfig";
import useGetUser from "../../Hooks/useGetUser";

const UserProfile = ({ currentUser }) => {
  const [currentUserData, setCurrentUserData] = useState();
  const { currentUserId, loading } = useGetUser();

  return (
    <>
      <div class="bg-white shadow rounded-lg border">
        <div class="px-4 py-5 sm:px-6 grid grid-cols-2">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              This is some information about the user.
            </p>
          </div>
          <img
            src={`${
              currentUser.profile_picture
                ? currentUser.profile_picture
                : "default-image.png"
            } `}
            className="h-16 w-16 rounded-full object-cover ring-3 ring-gray-100 lg:ml-[24rem] md:ml-[20rem] ml-[7rem]"
            onError={(event) => {
              event.target.src = "default-image.png";
            }}
          />
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div class="sm:divide-y sm:divide-gray-200">
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.first_name}
              </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Last Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.last_name}
              </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.email}
              </dd>
            </div>
            {/* <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                123 Main St
                <br />
                Anytown, USA 12345
              </dd>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
