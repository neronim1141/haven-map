import { useUsersQuery } from "graphql/client/graphql";

const Page = () => {
  const users = useUsersQuery();
  if (users.loading) {
    <>loading</>;
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/4 p-2">
        Users{" "}
        <table className="w-full table-fixed">
          {users.data?.users.map((user) => (
            <tr key={user.name} className="border-b">
              <td className="p-2 text-center">{user.name}</td>
              <td className="p-2 text-center">{user.role}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Page;
