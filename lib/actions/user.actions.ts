'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

type UpdateUserParams = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserParams): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error) {
    const _e = error as Error;
    throw new Error(`Failed to create/update user : ${_e.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'commnity',
    //   model: Community,
    // });
  } catch (error) {
    const _e = error as Error;
    throw new Error(`Failed to fetch user: ${_e.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all the threads authered by the user with the given userId

    // TODO: Populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });

    return threads;
  } catch (error) {
    const _e = error as Error;
    throw new Error(`Failed to fetch user posts: ${_e.message}`);
  }
}
