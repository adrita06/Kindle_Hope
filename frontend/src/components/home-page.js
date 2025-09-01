import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  
  const navigate = useNavigate();
  const [visibleCampaigns, setVisibleCampaigns] = useState(4);
  const [selectedFilter, setSelectedFilter] = useState('Filter Campaigns');

  const campaigns = [
    {
      id: 1,
      title: 'Build Schools for Rural Children',
      category: 'Education',
      description: 'Help us construct new classrooms and provide educational materials for children in remote villages who lack access to quality education.',
      raised: 12450,
      goal: 25000,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Medical Aid for Cancer Patients',
      category: 'Healthcare',
      description: 'Support cancer patients with treatment costs and medical supplies. Your donation can save lives and provide hope to families in need.',
      raised: 8750,
      goal: 15000,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Plant Trees, Save Our Planet',
      category: 'Environment',
      description: 'Join our reforestation efforts to combat climate change. Every tree planted makes a difference for future generations.',
      raised: 18200,
      goal: 20000,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Flood Relief Emergency Fund',
      category: 'Disaster Relief',
      description: 'Urgent help needed for flood victims. Provide shelter, food, and medical aid to families displaced by recent natural disasters.',
      raised: 22890,
      goal: 35000,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Save Stray Animals',
      category: 'Animals',
      description: 'Help us provide shelter, food, and medical care for abandoned and stray animals in our community.',
      raised: 5430,
      goal: 12000,
      image: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4281?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Care for Elderly Citizens',
      category: 'Elderly Care',
      description: 'Support our elderly care program providing daily meals, medical checkups, and companionship to senior citizens.',
      raised: 9120,
      goal: 18000,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop'
    }
  ];

  const categories = ['Education', 'Healthcare', 'Environment', 'Disaster Relief', 'Community', 'Animals', 'Children', 'Elderly Care'];

  const handleJoinCommunity = () => {
    navigate('/register')
    console.log('Navigate to register');
  };

  const handleSignIn = () => {
    navigate('/login')
    console.log('Navigate to login');
  };

  const loadMoreCampaigns = () => {
    setVisibleCampaigns(prev => Math.min(prev + 4, campaigns.length));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "60px"
  };

  const titleStyle = {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: "20px",
    margin: "0 0 20px 0"
  };

  const subtitleStyle = {
    fontSize: "1.5rem",
    color: "#16a34a",
    marginBottom: "40px",
    margin: "0 0 40px 0"
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "50px",
    textAlign: "center"
  };

  const descriptionStyle = {
    fontSize: "1.125rem",
    color: "#374151",
    lineHeight: "1.8",
    marginBottom: "40px"
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap"
  };

  const primaryButtonStyle = {
    backgroundColor: "#16a34a",
    color: "white",
    padding: "15px 30px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1.125rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  };

  const secondaryButtonStyle = {
    backgroundColor: "transparent",
    color: "#16a34a",
    padding: "15px 30px",
    borderRadius: "10px",
    border: "2px solid #16a34a",
    fontSize: "1.125rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  };

  const featuresStyle = {
    marginTop: "60px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px"
  };

  const featureCardStyle = {
    backgroundColor: "#f0fdf4",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #bbf7d0"
  };

  const featureIconStyle = {
    fontSize: "2rem",
    marginBottom: "15px"
  };

  const featureTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: "10px",
    margin: "0 0 10px 0"
  };

  const featureDescStyle = {
    color: "#374151",
    lineHeight: "1.6"
  };

  const campaignsSectionStyle = {
    marginTop: "80px",
    paddingTop: "40px",
    borderTop: "2px solid #bbf7d0"
  };

  const sectionHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px"
  };

  const sectionTitleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#15803d",
    margin: "0"
  };

  const filterDropdownStyle = {
    padding: "12px 20px",
    border: "2px solid #bbf7d0",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#15803d"
  };

  const campaignsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginBottom: "40px"
  };

  const campaignCardStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    border: "2px solid #bbf7d0",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer"
  };

  const CampaignCard = ({ campaign }) => (
    <div 
      style={campaignCardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(22, 163, 74, 0.2)";
        e.currentTarget.style.borderColor = "#16a34a";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "#bbf7d0";
      }}
    >
      <img
        src={campaign.image}
        alt={campaign.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover"
        }}
      />
      <div style={{ padding: "25px" }}>
        <h3 style={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#15803d",
          marginBottom: "10px",
          lineHeight: "1.3"
        }}>
          {campaign.title}
        </h3>
        <span style={{
          display: "inline-block",
          backgroundColor: "#f0fdf4",
          color: "#15803d",
          fontSize: "0.9rem",
          fontWeight: "600",
          borderRadius: "20px",
          padding: "5px 15px",
          marginBottom: "15px"
        }}>
          {campaign.category}
        </span>
        <p style={{
          color: "#6b7280",
          fontSize: "1rem",
          lineHeight: "1.6",
          marginBottom: "20px"
        }}>
          {campaign.description}
        </p>
        
        <div style={{ marginBottom: "20px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "0.95rem"
          }}>
            <span style={{ fontWeight: "bold", color: "#16a34a" }}>
              {formatCurrency(campaign.raised)} raised
            </span>
            <span style={{ color: "#6b7280" }}>
              of {formatCurrency(campaign.goal)}
            </span>
          </div>
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)",
                borderRadius: "10px",
                width: `${getProgressPercentage(campaign.raised, campaign.goal)}%`,
                transition: "width 0.3s ease"
              }}
            ></div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            flex: "2",
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}>
            Donate Now
          </button>
          <button style={{
            flex: "1",
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#e5e7eb";
            e.target.style.color = "#374151";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
            e.target.style.color = "#6b7280";
          }}>
            Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Welcome to Kindle Hope</h1>
        <p style={subtitleStyle}>Making a difference through community-driven donations</p>
      </div>

      <div style={contentStyle}>
        <p style={descriptionStyle}>
          Join our community-driven donation management platform where kindness meets efficiency. 
          Connect with those in need, contribute to meaningful causes, and track the impact of your generosity.
        </p>

        <div style={buttonContainerStyle}>
          <button 
            onClick={handleJoinCommunity}
            style={primaryButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
          >
            Join Our Community
          </button>
          <button 
            onClick={handleSignIn}
            style={secondaryButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#16a34a"
              e.target.style.color = "white"
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent"
              e.target.style.color = "#16a34a"
            }}
          >
            Sign In
          </button>
        </div>

        <div style={featuresStyle}>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🤝</div>
            <h3 style={featureTitleStyle}>Community Driven</h3>
            <p style={featureDescStyle}>
              Connect with donors and trustable organizations to build a stronger, more supportive community.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>💝</div>
            <h3 style={featureTitleStyle}>Easy Donations</h3>
            <p style={featureDescStyle}>
              Simple and secure donation process that makes helping others effortless and transparent.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>📊</div>
            <h3 style={featureTitleStyle}>Track Impact</h3>
            <p style={featureDescStyle}>
              See the real impact of your contributions and how they're making a difference in people's lives.
            </p>
          </div>
        </div>

        {/* Campaigns Section */}
        <div style={campaignsSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Featured Campaigns</h2>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={filterDropdownStyle}
            >
              <option>Filter Campaigns</option>
              <option>Most Recent</option>
              <option>Most Urgent</option>
              <option>Nearly Funded</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Emergency</option>
            </select>
          </div>

          <div style={campaignsGridStyle}>
            {campaigns.slice(0, visibleCampaigns).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {visibleCampaigns < campaigns.length && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={loadMoreCampaigns}
                style={{
                  ...primaryButtonStyle,
                  padding: "18px 40px",
                  fontSize: "1.2rem"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
              >
                Load More Campaigns
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}