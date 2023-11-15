import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import PostView from "~/components/postView";

import { type NextPage } from "next";
import LoadingPage, { LoadingSpinner } from "~/components/loading";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";

const CreatePostWizard: NextPage = () => {
  const [input, setInput] = useState("");

  const ctx = api.useUtils();

  const { user } = useUser();
  if (!user) return null;

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      const error = err.data?.zodError?.fieldErrors.content;
      if (error?.[0]) {
        toast.error(error[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="flex w-full items-center gap-4">
      <Image
        src={user.imageUrl}
        alt="profile picture"
        width={100}
        height={100}
        className="h-14 w-14 rounded-full"
      />
      <input
        type="text"
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input !== "") {
            e.preventDefault();
            mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.post.getAll.useQuery();
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4 ">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
